import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Inject,
	Param,
	Post,
	Put,
	Query,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { ICurrentUser } from "interfaces/current-user.interface";

import { RoleType } from "../../constants";
import { ApiErrorResponse, User } from "../../decorators";
import { Roles, RolesGuard } from "../../guards/roles.guard";
import { TransformInterceptor } from "../../interceptors/transform.interceptor";
import { AnalyticsService } from "../analytics/analytics.service";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { CityNotFoundError } from "../cities/errors/CityNotFound.error";

import { CreateProjectMetaDataDto } from "./dto/CreateProject.dto";
import { ProjectFilterDto } from "./dto/ProjectFilter.dto";
import { UpdateProjectMetaDataDto } from "./dto/UpdateProject.dto";
import { ProjectService } from "./projects.service";

@ApiTags("Projects")
@Controller("projects")
@UseInterceptors(TransformInterceptor)
export class ProjectsController {
	constructor(
		private projectsService: ProjectService,
		@Inject()
		private readonly analyticsService: AnalyticsService,
	) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	async getAllProjects(@Query() dto: ProjectFilterDto) {
		return await this.projectsService.getAllProjects(dto.city_id);
	}

	@Get("/unique_dates")
	@HttpCode(HttpStatus.OK)
	async getUniqueEndDates() {
		return await this.projectsService.getUniqueEndDates();
	}

	@Roles([RoleType.AFFILIATE_MANAGER])
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiErrorResponse(CityNotFoundError, "id: 1")
	async createProject(
		@Body() dto: CreateProjectMetaDataDto,
		@User() user: ICurrentUser,
	) {
		const res = await this.projectsService.create(dto.data);
		await this.analyticsService.incrementCreatedCount(user.analytics_id!);
		return res;
	}

	@Roles([RoleType.AFFILIATE_MANAGER])
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Put(":id")
	@HttpCode(HttpStatus.OK)
	async updateProject(
		@Param("id") id: number,
		@Body() dto: UpdateProjectMetaDataDto,
	) {
		return await this.projectsService.update(id, dto.data);
	}

	@Roles([RoleType.AFFILIATE_MANAGER])
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Delete(":id")
	@HttpCode(HttpStatus.OK)
	async delete(@Param("id") id: number) {
		return await this.projectsService.delete(id);
	}
}
