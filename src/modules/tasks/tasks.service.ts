import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { BaseDto } from "../../common/base/base_dto";
import { UserService } from "../user/user.service";
import { ClientService } from "../client/client.service";
import { LeadsService } from "../leads/leads.service";
import { ProjectService } from "../projects/projects.service";
import { Order } from "../../constants";

import {
	CreateTaskDto,
	FinishTaskDto,
	ReadAllTasksDto,
	TaskSortBy,
} from "./dto";
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

	get repository(): Repository<TasksEntity> {
		return this.taskRepository;
	}

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
				client: {
					id: true,
					fullname: true,
					phone_number: true,
					email: true,
				},
				manager: { id: true, fullName: true },
				lead: { id: true, current_status: true },
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

		const query = this.taskRepository
			.createQueryBuilder("task")
			.leftJoinAndSelect("task.client", "client")
			.leftJoinAndSelect("task.project", "project")
			.select([
				"task.id",
				"task.task_type",
				"task.comment",
				"task.status",
				"task.start_date",
				"task.end_date",
				"task.created_at",
				"client.id",
				"client.fullname",
				"project.id",
				"project.name",
			])
			.skip(pageSize)
			.take(payload.limit);

		if (payload.is_archived) {
			query
				.where("task.end_date < :currentDate", {
					currentDate: new Date(),
				})
				.orWhere("task.status = :status", { status: TaskStatus.CLOSE });
		} else {
			query
				.where("task.end_date >= :currentDate", {
					currentDate: new Date(),
				})
				.andWhere("task.status != :status", {
					status: TaskStatus.CLOSE,
				});
		}

		switch (payload.sort_by) {
			case TaskSortBy.CLIENT_FULLNAME:
				query.orderBy("client.fullname", payload.order_by || Order.ASC);
				break;
			case TaskSortBy.PROJECT_NAME:
				query.orderBy("project.name", payload.order_by || Order.ASC);
				break;
			case TaskSortBy.END_DATE:
				query.orderBy("task.end_date", payload.order_by || Order.ASC);
				break;
			case TaskSortBy.TASK_TYPE:
				query.orderBy("task.task_type", payload.order_by || Order.ASC);
				break;
			default:
				query.orderBy("task.created_at", Order.DESC);
				break;
		}

		const [tasks, count] = await query.getManyAndCount();

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
