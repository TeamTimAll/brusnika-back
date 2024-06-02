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
} from '@nestjs/common';

import { ProjectsService } from './projects.service';
import { Uuid } from 'boilerplate.polyfill';
import { CreateProjectDto } from './dto/project.create.dto';
import { UpdateProjectDto } from './dto/projects.update.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllProjects() {
    return this.projectsService.getAllProjects();
  }

  @Get('/unique_dates')
  @HttpCode(HttpStatus.OK)
  async getUniqueEndDates() {
    return this.projectsService.getUniqueEndDates();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProject(@Body() projectDto: CreateProjectDto) {
    return this.projectsService.createProjects(projectDto);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  async updateProject(@Body() projectDto: UpdateProjectDto) {
    return this.projectsService.updateProject(projectDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteProject(@Param('id') id: Uuid) {
    return this.projectsService.deleteProject(id);
  }
}
