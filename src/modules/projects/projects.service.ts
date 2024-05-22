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
import { PremisesEntity } from 'modules/premises/premise.entity';

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


    async createProjects ( createProjectDto : CreateProjectDto , fileName : string  )
     : Promise<CreateProjectDto | HttpException>{
        try {

            const newProject =   await this.projectsRepository.save({
                ...createProjectDto, photo : fileName
           })
            
           return newProject

            
        } catch (error) {

            return new HttpException("Something went wrong" , 500)
            
        }
    }


    async getOneProject( id : Uuid) : Promise<ProjectEntity | null>{
          ;

          const project = await  this.projectsRepository.findOne({
              where : { id },
              relations : {
                clients : true ,
                premises : true ,
                user : true 
              }
          });

          return project
    };


    async updateProject( updateProjectDto : UpdateProjectDto )
    : Promise<HttpException | ProjectEntity>
    {
         try {


        const project = await this.getOneProject(updateProjectDto.projectId);

        if(!project) return  new HttpException("Project not found " , 404);


        const updatedProject = await this.projectsRepository.merge(project , updateProjectDto)
        await this.projectsRepository.save(updatedProject)

        return updatedProject

            
         } catch (error) {
            return new HttpException("Something went wrong" , 500)
            
         }
        

    }


    async deleteProject( id : Uuid ) 
      : Promise<ProjectEntity | HttpException>
    {
             try {

                const project = await this.getOneProject(id);

                if(!project) return new HttpException("Project not found " , 404);

                await this.projectsRepository.remove(project)
                return project

                
             } catch (error) {

                return  new HttpException("Something went wrong" , 500)
                
             } 
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



    async getOnePremise ( id : Uuid)
      : Promise<PremisesEntity | HttpException>
     {
           try {
            
            const premise = await this.premiseService.getPremise(id);

            if(!premise ) return new HttpException("Premise not found ", 404);
  
            return premise 

           } catch (error) {
            return new HttpException("Something went wrong" , 500)
           }

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
