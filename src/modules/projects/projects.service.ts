import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectEntity } from './project.entity';
import { Uuid } from 'boilerplate.polyfill';
import { HttpException } from '@nestjs/common';
import { ProjectSDto } from './dto/projects.dto';
import { CreateProjectDto } from './dto/project.create.dto';
import { UpdateProjectDto } from "./dto/projects.update.dto"


@Injectable()
export class ProjectsService {

    constructor(
            @InjectRepository(ProjectEntity)
            private projectsRepository : Repository<ProjectEntity>,
    ){}


    async getAllProjects() : Promise<ProjectSDto[]> {
         return  await this.projectsRepository.find({
            relations : {
                premises : true ,
                commercialBuildings : true ,
                storages : true ,
                carParkings : true 
            }
         })
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

          const project = await  this.projectsRepository.findOne({
              where : { id },
              relations : {
                clients : true ,
                premises : true ,
                commercialBuildings : true ,
                storages : true ,
                carParkings : true 
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



}
