import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Inject,
	Param,
	Post,
	Put,
	Query,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { ICurrentUser } from "interfaces/current-user.interface";

import { ApiDtoResponse, ApiErrorResponse, User } from "../../decorators";
import { RolesGuard } from "../../guards/roles.guard";
import { TransformInterceptor } from "../../interceptors/transform.interceptor";
import { AnalyticsService } from "../analytics/analytics.service";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";

import { CreateNotificationMetaDataDto } from "./dto/CreateNotification.dto";
import { NotificationMetaDataDto } from "./dto/Notification.dto";
import { NotificationFilterDto } from "./dto/NotificationFilter.dto";
import { ReadAllNotificationMetaDataDto } from "./dto/ReadAllNotification.dto";
import { UpdateNotificationMetaDataDto } from "./dto/UpdateNotification.dto";
import { NotificationNotFoundError } from "./errors/NotificationNotFound.error";
import { NotificationService } from "./notification.service";

@ApiTags("Notification")
@Controller("notification")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(TransformInterceptor)
export class NotificationController {
	constructor(
		private notificationService: NotificationService,
		@Inject()
		private readonly analyticsService: AnalyticsService,
	) {}

	@Get()
	@ApiOperation({
		description: "### Notification list'i foydalanuchiga nisbattan olish.",
	})
	@ApiDtoResponse(ReadAllNotificationMetaDataDto, HttpStatus.OK)
	readAll(@Query() dto: NotificationFilterDto, @User() user: ICurrentUser) {
		return this.notificationService.readAll(dto, user);
	}

	@Get(":id")
	@ApiOperation({ description: "### Notification id bo'yicha olish." })
	@ApiDtoResponse(NotificationMetaDataDto, HttpStatus.OK)
	@ApiErrorResponse(NotificationNotFoundError, "id: 'id'")
	readOne(@Param("id") id: number) {
		return this.notificationService.readOne(id);
	}

	@Post()
	@ApiOperation({ description: "### Notification yasash." })
	@ApiDtoResponse(NotificationMetaDataDto, HttpStatus.CREATED)
	async create(
		@Body() dto: CreateNotificationMetaDataDto,
		@User() user: ICurrentUser,
	) {
		const res = this.notificationService.create(dto.data, user);
		await this.analyticsService.incrementCreatedCount(user.analytics_id!);
		return res;
	}

	@Put(":id")
	@ApiOperation({ description: "### Notification id bo'yicha yangilash." })
	@ApiDtoResponse(NotificationMetaDataDto, HttpStatus.OK)
	@ApiErrorResponse(NotificationNotFoundError, "id: 'id'")
	async updateProject(
		@Param("id") id: number,
		@Body() dto: UpdateNotificationMetaDataDto,
	) {
		return this.notificationService.update(id, dto.data);
	}

	@Delete(":id")
	@ApiOperation({ description: "### Notification id bo'yicha o'chirish." })
	@ApiDtoResponse(NotificationMetaDataDto, HttpStatus.OK)
	@ApiErrorResponse(NotificationNotFoundError, "id: 'id'")
	async deleteProject(@Param("id") id: number) {
		return this.notificationService.delete(id);
	}
}
