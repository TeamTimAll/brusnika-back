import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectEntity } from './project.entity';
import { Uuid } from 'boilerplate.polyfill';
import { HttpException } from '@nestjs/common';
import { ProjectSDto } from './dto/projects.dto';
import { CreateProjectDto } from './dto/project.create.dto';
import { UpdateProjectDto } from './dto/projects.update.dto';
@Injectable()
export class ProjectsService {

    constructor(
            @InjectRepository(ProjectEntity)
            private projectsRepository : Repository<ProjectEntity>
    ){}


    async getAllProjects() : Promise<ProjectSDto[]> {
         return  await this.projectsRepository.find()
    }


    async createProjects ( createProjectDto : CreateProjectDto ) : Promise<CreateProjectDto>{
        return  await this.projectsRepository.save(createProjectDto)
    }


    async getOneProject( id : Uuid) : Promise<ProjectEntity | null>{
          const queryBuilder = await this.projectsRepository.createQueryBuilder("Projects")
          .where("Projects.id :=id" , { id })

          const project = await queryBuilder.getOne();
          return project
    };


    async updateProject( updateProjectDto : UpdateProjectDto ){

        const project = await this.getOneProject(updateProjectDto.projectId);

        if(!project) return  new HttpException("Project not found " , 404);


        const updatedProject = await this.projectsRepository.merge(project , updateProjectDto)
        await this.projectsRepository.save(updatedProject)

        return updatedProject
        

    }


    async deleteProject( id : Uuid ) {
          const project = await this.getOneProject(id);

          if(!project) return new HttpException("Project not found " , 404);

          await this.projectsRepository.remove(project)
          return true 
    }
}
