import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LessThan, Repository } from "typeorm";

import { BaseDto } from "../../common/base/base_dto";
import { UserService } from "../user/user.service";
import { ClientService } from "../client/client.service";
import { LeadsService } from "../leads/leads.service";
import { ProjectService } from "../projects/projects.service";

import { CreateTaskDto, FinishTaskDto, ReadAllTasksDto } from "./dto";
import { TaskNotFoundError } from "./errors/task-not-found.error";
import { TasksEntity, TaskStatus } from "./tasks.entity";

@Injectable()
export class TasksService {
	constructor(
		@InjectRepository(TasksEntity)
		private taskRepository: Repository<TasksEntity>,
		private readonly userService: UserService,
		private readonly clientService: ClientService,
		private readonly leadService: LeadsService,
		private readonly projectService: ProjectService,
	) {}

	async create(payload: CreateTaskDto) {
		await this.userService.checkExists(payload.manager_id);
		await this.clientService.checkExists(payload.client_id);
		await this.projectService.checkExists(payload.project_id);

		await this.leadService.readOne(payload.lead_id);

		const task = this.taskRepository.create({ ...payload });

		return await this.taskRepository.save(task);
	}

	async readOne(id: number) {
		const findOne = await this.taskRepository.findOne({
			where: { id },
			select: {
				client: { id: true, fullname: true, phone_number: true },
				manager: { id: true, fullName: true },
				lead: { id: true },
				project: { id: true, name: true },
			},
			relations: {
				lead: true,
				client: true,
				manager: true,
				project: true,
			},
		});

		if (!findOne) {
			throw new TaskNotFoundError(`'${id}' task not found`);
		}

		return findOne;
	}

	async readAll(payload: ReadAllTasksDto) {
		const pageSize = (payload.page - 1) * payload.limit;

		const whereCondition = payload.is_archived
			? {
					status: TaskStatus.CLOSE,
					end_date: LessThan(new Date()),
				}
			: {};

		const [tasks, count] = await this.taskRepository.findAndCount({
			where: whereCondition,
			select: {
				id: true,
				task_type: true,
				comment: true,
				end_date: true,
				client: { id: true, fullname: true },
				project: { id: true, name: true },
			},
			relations: { client: true, project: true },
			skip: pageSize,
			take: payload.limit,
		});

		const metaData = BaseDto.create<TasksEntity[]>();
		metaData.setPagination(count, payload.page, payload.limit);

		metaData.data = tasks;

		return metaData;
	}

	async finish(id: number, payload: FinishTaskDto) {
		const task = await this.readOne(id);

		const updatedTask = this.taskRepository.merge(task, {
			status: TaskStatus.CLOSE,
			comment: payload.comment,
		});

		return await this.taskRepository.save(updatedTask);
	}
}
