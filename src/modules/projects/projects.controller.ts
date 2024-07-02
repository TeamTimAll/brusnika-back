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
	UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { ICurrentUser } from "interfaces/current-user.interface";

import { BaseDto } from "../../common/base/base_dto";
import { User } from "../../decorators";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";

import { CreateProjectMetaDataDto } from "./dto/project.create.dto";
import { UpdateProjectMetaDataDto } from "./dto/projects.update.dto";
import { ProjectsService } from "./projects.service";

@ApiTags("Projects")
@Controller("projects")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ProjectsController {
	constructor(private projectsService: ProjectsService) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	async getAllProjects(@User() user?: ICurrentUser) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		metaData.data = await this.projectsService.getAllProjects(user);
		return metaData;
	}

	@Get("/unique_dates")
	@HttpCode(HttpStatus.OK)
	async getUniqueEndDates() {
		const metaData = BaseDto.createFromDto(new BaseDto());
		metaData.data = await this.projectsService.getUniqueEndDates();
		return metaData;
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async createProject(@Body() projectDto: CreateProjectMetaDataDto) {
		const metaData = BaseDto.createFromDto(projectDto);
		const createdProject = await this.projectsService.createProjects(
			projectDto.data,
		);
		metaData.data = createdProject;
		return metaData;
	}

	@Put()
	@HttpCode(HttpStatus.OK)
	async updateProject(@Body() projectDto: UpdateProjectMetaDataDto) {
		const metaData = BaseDto.createFromDto(projectDto);
		const updatedProject = await this.projectsService.updateProject(
			projectDto.meta.params.project_id,
			projectDto.data,
		);
		metaData.data = updatedProject;
		return metaData;
	}

	@Delete(":id")
	@HttpCode(HttpStatus.OK)
	async deleteProject(@Param("id") id: string) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		const deletedProject = await this.projectsService.deleteProject(id);
		metaData.data = deletedProject;
		return metaData;
	}
}
