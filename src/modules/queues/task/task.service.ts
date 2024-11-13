import { forwardRef, Inject, Injectable } from "@nestjs/common";

import { BookingsService } from "../../bookings/bookings.service";
import { UserService } from "../../user/user.service";
import { ClientService } from "../../client/client.service";
import { TasksService } from "../../tasks/tasks.service";
import { ProjectService } from "../../projects/projects.service";

import { TaskDto } from "./dto";

@Injectable()
export class TaskQueueService {
	constructor(
		@Inject(forwardRef(() => BookingsService))
		private readonly taskService: TasksService,
		private readonly userService: UserService,
		private readonly clientService: ClientService,
		private readonly projectService: ProjectService,
	) {}

	async createOrUpdateBooking(task: TaskDto) {
		const foundManager = await this.userService.readOneByExtId(
			task.manager_ext_id,
			{ id: true, agent: { id: true } },
		);

		const foundClient = await this.clientService.readOneByExtId(
			task.client_ext_id,
			{ id: true },
		);

		const foundProject = await this.projectService.readOneByExtId(
			task.project_ext_id,
			{ id: true },
		);

		const foundLead = await this.projectService.readOneByExtId(
			task.lead_ext_id,
			{ id: true },
		);

		return this.taskService.repository
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
				],
				["ext_id"],
			)
			.execute();
	}
}
