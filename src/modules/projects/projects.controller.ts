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
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { BaseDto } from "../../common/base/base_dto";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";

import {
	CreateProjectDto,
	CreateProjectMetaDataDto,
} from "./dto/project.create.dto";
import { ProjectFilterDto } from "./dto/projects.dto";
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
	async getAllProjects(@Query() dto: ProjectFilterDto) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		metaData.data = await this.projectsService.getAllProjects(dto.city_id);
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
		metaData.data = updatedProject as CreateProjectDto;
		return metaData;
	}

	@Delete(":id")
	@HttpCode(HttpStatus.OK)
	async deleteProject(@Param("id") id: number) {
		const metaData = BaseDto.createFromDto(new BaseDto());
		const deletedProject = await this.projectsService.deleteProject(id);
		metaData.data = deletedProject;
		return metaData;
	}
}
