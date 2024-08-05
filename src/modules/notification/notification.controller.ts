import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Put,
	Query,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { RolesGuard } from "../../guards/roles.guard";
import { TransformInterceptor } from "../../interceptors/transform.interceptor";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";

import { CreateNotificationMetaDataDto } from "./dto/CreateNotification.dto";
import { NotificationFilterDto } from "./dto/NotificationFilter.dto";
import { UpdateNotificationMetaDataDto } from "./dto/UpdateNotification.dto";
import { NotificationService } from "./notification.service";

@ApiTags("Notification")
@Controller("notification")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(TransformInterceptor)
export class NotificationController {
	constructor(private notificationService: NotificationService) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	readAll(@Query() dto: NotificationFilterDto) {
		return this.notificationService.readAll(dto);
	}

	@Get(":id")
	@HttpCode(HttpStatus.OK)
	readOne(@Param("id") id: number) {
		return this.notificationService.readOne(id);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() dto: CreateNotificationMetaDataDto) {
		return this.notificationService.create(dto.data);
	}

	@Put(":id")
	@HttpCode(HttpStatus.OK)
	async updateProject(
		@Param("id") id: number,
		@Body() dto: UpdateNotificationMetaDataDto,
	) {
		return this.notificationService.update(id, dto.data);
	}

	@Delete(":id")
	@HttpCode(HttpStatus.OK)
	async deleteProject(@Param("id") id: number) {
		return this.notificationService.delete(id);
	}
}
