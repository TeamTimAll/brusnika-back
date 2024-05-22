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
import { CreatePremisesDto } from '../../modules/premises/dtos/premise.create.dto';
import { UpdatePremiseDto } from '../../modules/premises/dtos/premise.update.dto';

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
          ;

          const project = await  this.projectsRepository.findOne({
              where : { id }
          });

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


    async addPremiseToProject ( premiseBody : CreatePremisesDto , projectId : Uuid   ){
            
        try {

            const project = await this.getOneProject(projectId);


            if(!project) return new HttpException("Project  not found " , 404);

            const newPremise = await this.premiseService.createPremise(premiseBody)

            if(!newPremise) return new HttpException("Something went wrong when creating premises" , 500)

            return newPremise
            
        } catch (error) {
            return new HttpException("Something went wrong ", 500)
            
        }
    }



    async getOnePremise ( id : Uuid) {
          const premise = await this.premiseService.getPremise(id);

          if(!premise ) return new HttpException("Premise not found ", 404);

          return premise 

    }




    async updateOnePremise( premiseUpdateBody : UpdatePremiseDto , id : Uuid){
           try {
            
            const isPremiseUpdated = 
             await  this.premiseService.updatePremise(premiseUpdateBody ,id );

             if(!isPremiseUpdated) return new HttpException("Something went wrong" , 500)

             return  isPremiseUpdated
           } catch (error) {
            return  new HttpException("Something went wrong " , 500)
           }
    }

      async  deletePremise ( id :Uuid) {
          try {

            const premise = await this.premiseService.getPremise(id)
            if(!premise) return new HttpException("Premise not found " , 404);
            const deletedPremise =    await this.premiseService.deletePremise(id)
            return deletedPremise 
            
          } catch (error) {
            return new HttpException("Something went wrong " , 500)
            
          }
      }


}
