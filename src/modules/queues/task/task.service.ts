import { forwardRef, Inject, Injectable } from "@nestjs/common";

import { UserService } from "../../user/user.service";
import { ClientService } from "../../client/client.service";
import { TasksService } from "../../tasks/tasks.service";
import { ProjectService } from "../../projects/projects.service";
import { QueueService } from "../queue.service";
import { BaseDto } from "../../../common/base/base_dto";
import { TasksEntity } from "../../tasks/tasks.entity";
import { UserEntity } from "../../user/user.entity";
import { ProjectEntity } from "../../projects/project.entity";
import { LeadsEntity } from "../../leads/leads.entity";
import { LeadsService } from "../../leads/leads.service";
import { NotificationService } from "../../notification/notification.service";
import { NotificationType } from "../../notification/notification.entity";

import { TaskDto, TasksDto } from "./dto";
import { ITask } from "./types";

@Injectable()
export class TaskQueueService {
	constructor(
		@Inject(forwardRef(() => TasksService))
		private readonly taskService: TasksService,
		private readonly userService: UserService,
		private readonly clientService: ClientService,
		private readonly projectService: ProjectService,
		private readonly leadsService: LeadsService,
		private readonly queueService: QueueService,
		private readonly notificationService: NotificationService,
	) {}

	async createOrUpdateTask(task: TaskDto) {
		const foundManager = await this.userService.readOneByExtId(
			task.manager_ext_id,
			{ id: true, firebase_token: true },
		);

		const foundUser = await this.userService.readOneByExtId(
			task.created_by_ext_id,
			{ id: true },
		);

		const foundClient = await this.clientService.readOneByExtId(
			task.client_ext_id,
			{ id: true },
		);

		const foundProject = await this.projectService.readOneByExtId(
			task.project_ext_id,
			{ id: true, name: true },
		);

		const foundLead = await this.leadsService.readOneByExtId(
			task.lead_ext_id,
			{ id: true },
		);

		const result = await this.taskService.repository
			.createQueryBuilder()
			.insert()
			.values({
				ext_id: task.ext_id,
				client_id: foundClient.id,
				manager_id: foundManager.id,
				project_id: foundProject.id,
				lead_id: foundLead.id,
				comment: task.comment,
				task_type: task.task_type,
				status: task.status,
				end_date: task.end_date,
				start_date: task.start_date,
				created_by_id: foundUser.id,
			})
			.orUpdate(
				[
					"client_id",
					"manager_id",
					"project_id",
					"lead_id",
					"comment",
					"task_type",
					"status",
					"end_date",
					"start_date",
					"created_by_id",
				],
				["ext_id"],
			)
			.returning("*")
			.execute();

		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
		const taskId = result.raw[0]?.id;

		if (taskId && foundManager.firebase_token) {
			const userTokens = [foundManager];

			await this.notificationService.sendToUsers(userTokens, {
				title: "Сделки",
				description: `Статус сделки по #${taskId} изменился`,
				type: NotificationType.TASK_STATE_CHANGE,
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				object_id: taskId,
			});
		}

		return result;
	}

	async createTasks({ data: tasks }: TasksDto) {
		for await (const task of tasks) {
			await this.createOrUpdateTask(task);
		}
	}

	async makeRequest(task: ITask) {
		const data: Pick<BaseDto<ITask>, "data"> = {
			data: task,
		};
		await this.queueService.send(data);
	}

	async createFormEntity(task: TasksEntity): Promise<ITask> {
		let manager: UserEntity | undefined;
		if (task.manager_id) {
			manager = await this.userService.readOne(task.manager_id, {
				id: true,
			});
		}

		let user: UserEntity | undefined;
		if (task.created_by_id) {
			user = await this.userService.readOne(task.created_by_id);
		}

		let project: ProjectEntity | undefined;
		if (task.project_id) {
			project = await this.projectService.readOne(task.project_id, {
				id: true,
			});
		}

		let lead: LeadsEntity | undefined;
		if (task.lead_id) {
			lead = await this.leadsService.readOne(task.lead_id);
		}

		return {
			url: `https://1c.tarabanov.tech/crm/hs/bpm/deal-tasks/${lead?.ext_id}`,
			method: "POST",
			data: {
				authorId: user?.ext_id,
				deadline: task.end_date,
				description: task.comment,
				methodCarryng: "OFFLINE",
				ownerId: manager?.ext_id,
				premiseKind: lead?.premise?.type,
				projectId: project?.ext_id,
				roomsId: null,
			},
		};
	}
}
