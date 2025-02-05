import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Put,
	Query,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { RoleType } from "../../constants";
import { Roles, RolesGuard } from "../../guards/roles.guard";
import { TransformInterceptor } from "../../interceptors/transform.interceptor";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { ICurrentUser } from "../../interfaces/current-user.interface";
import { User } from "../../decorators";

import {
	CreateTaskMetaDataDto,
	FinishTaskMetaDataDto,
	ReadAllTasksDto,
} from "./dto";
import { TasksService } from "./tasks.service";

@ApiTags("Tasks")
@Controller("tasks")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles([
	RoleType.MANAGER,
	RoleType.ADMIN,
	RoleType.AFFILIATE_MANAGER,
	RoleType.HEAD_OF_AGENCY,
])
@UseInterceptors(TransformInterceptor)
export class TasksController {
	constructor(private service: TasksService) {}

	@Get()
	@ApiOperation({ summary: "Get all tasks" })
	async getAll(@Query() query: ReadAllTasksDto) {
		return this.service.readAll(query);
	}

	@Post()
	@ApiOperation({ summary: "create task" })
	async create(
		@Body() dto: CreateTaskMetaDataDto,
		@User() user: ICurrentUser,
	) {
		return await this.service.create(dto.data, user);
	}

	@Put("finish/:id")
	@ApiOperation({ summary: "finish task" })
	finish(@Param("id") id: number, @Body() payload: FinishTaskMetaDataDto) {
		return this.service.finish(id, payload.data);
	}

	@Get(":id")
	@ApiOperation({ summary: "Get task by id" })
	async getById(@Param("id") id: number) {
		return this.service.readOne(id);
	}
}
