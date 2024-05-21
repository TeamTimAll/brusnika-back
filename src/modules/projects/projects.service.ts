import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectEntity } from './project.entity';
import { Uuid } from 'boilerplate.polyfill';
import { HttpException } from '@nestjs/common';
import { ProjectSDto } from './dto/projects.dto';
import { CreateProjectDto } from './dto/project.create.dto';
import { UpdateProjectDto } from "./dto/projects.update.dto"
import { PremisesService } from '../../modules/premises/premises.service';

@Injectable()
export class ProjectsService {

    constructor(
            @InjectRepository(ProjectEntity)
            private projectsRepository : Repository<ProjectEntity>,
            private  premiseService : PremisesService
    ){}


    async getAllProjects() : Promise<ProjectSDto[]> {
         return  await this.projectsRepository.find()
    }


    async createProjects ( createProjectDto : CreateProjectDto ) : Promise<CreateProjectDto>{

        console.log({
              createProjectDto
        });

        const newProject =   await this.projectsRepository.save(createProjectDto)
         
        return newProject
    }


    async getOneProject( id : Uuid) : Promise<ProjectEntity | null>{
          const queryBuilder = await this.projectsRepository.createQueryBuilder("project")
          .where('project.id = :id', { id });

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


    async addPremiseToProject ( projectId : Uuid , premiseBody : any ){
            
        try {

            const project = await this.getOneProject(projectId);


            if(!project) return new HttpException("Project  not found " , 404);

            const newPremise = await this.premiseService.createPremise({
                ...premiseBody , projectId
            })

            return newPremise
            
        } catch (error) {
            return new HttpException("Something went wrong ", 500)
            
        }
    }
}
