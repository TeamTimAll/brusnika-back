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

import { RoleType } from "../../constants";
import { ApiErrorResponse } from "../../decorators";
import { Roles, RolesGuard } from "../../guards/roles.guard";
import { TransformInterceptor } from "../../interceptors/transform.interceptor";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { CityNotFoundError } from "../cities/errors/CityNotFound.error";

import { CreateProjectMetaDataDto } from "./dto/CreateProject.dto";
import { ProjectFilterDto } from "./dto/ProjectFilter.dto";
import { UpdateProjectMetaDataDto } from "./dto/UpdateProject.dto";
import { ProjectService } from "./projects.service";
import { ProjectSearchDto } from "./dto/ProjectSearch.dto";

@ApiTags("Projects")
@Controller("projects")
@UseInterceptors(TransformInterceptor)
export class ProjectsController {
	constructor(private projectsService: ProjectService) {}

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

	@Get("/search")
	@HttpCode(HttpStatus.OK)
	async search(@Query() dto: ProjectSearchDto) {
		return await this.projectsService.search(dto);
	}

	@Roles([RoleType.AFFILIATE_MANAGER, RoleType.ADMIN])
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiErrorResponse(CityNotFoundError, "id: 1")
	async createProject(@Body() dto: CreateProjectMetaDataDto) {
		const res = await this.projectsService.create(dto.data);
		return res;
	}

	@Roles([RoleType.AFFILIATE_MANAGER, RoleType.ADMIN])
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

	@Roles([RoleType.AFFILIATE_MANAGER, RoleType.ADMIN])
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Delete(":id")
	@HttpCode(HttpStatus.OK)
	async delete(@Param("id") id: number) {
		return await this.projectsService.delete(id);
	}
}
