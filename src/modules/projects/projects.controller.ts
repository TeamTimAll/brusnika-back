import { 
       Body, Controller 
     , Delete, Get, HttpCode, 
       HttpStatus , Param, Post,
       Put, 
       UploadedFile
     } from '@nestjs/common';

import { ProjectsService } from './projects.service';
import { Uuid } from 'boilerplate.polyfill';
import { CreateProjectDto } from './dto/project.create.dto';
import { UpdateProjectDto } from  "./dto/projects.update.dto"
import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from "multer"
import {v4 as uuidv4  } from "uuid"
import { CreatePremisesDto } from '../../modules/premises/dtos/premise.create.dto';
import { UpdatePremiseDto } from '../../modules/premises/dtos/premise.update.dto';
import { ApiTags } from '@nestjs/swagger';
import path from 'path';



@ApiTags("Projects")
@Controller('projects')
export class ProjectsController {

    constructor ( private projectsService : ProjectsService){ }

    @Get()
    @HttpCode(HttpStatus.OK)
    async getAllProjects(){
        return this.projectsService.getAllProjects()
    }

    @Post()
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: path.join(__dirname, '..', 'media'),
            filename: (_, file, cb) => {
                const uniqueId = uuidv4();
                const filename = `${uniqueId}-${file.originalname}`;
                cb(null, filename);
            }
        }),
    }))
    @HttpCode(HttpStatus.CREATED)
    
    async createProject(
        @Body() projectDto: CreateProjectDto,
        @UploadedFile()  file : Express.Multer.File 
    ) {
        console.log({
              file 
        })
        return this.projectsService.createProjects(projectDto, file.filename);
    }



    @Put()
    @HttpCode(HttpStatus.OK) 
    async updateProject ( @Body()  projectDto : UpdateProjectDto ){
        return this.projectsService.updateProject(projectDto)
    };
    
   
    @Delete(":id")
    @HttpCode(HttpStatus.OK)
    async deleteProject( @Param("id") id : Uuid) {
        return this.projectsService.deleteProject(id)
    }



    //Premises request 


    @Post("premise")
    @HttpCode(HttpStatus.CREATED)
    async createPremise (
         @Body() premiseBody : CreatePremisesDto ,
        ) {
          return this.projectsService.addPremiseToProject(premiseBody)
    }


    @Get("premise/:id")
    @HttpCode(HttpStatus.OK)
    async getPremise (@Param("id") id : Uuid) {
        return this.projectsService.getOnePremise(id)
    };

    @Put("premise/:id")
    @HttpCode(HttpStatus.OK)
    async updatePremise (
        @Param("id") id : Uuid,
       @Body() premiseUpdateBody : UpdatePremiseDto) {
        return this.projectsService.updateOnePremise(premiseUpdateBody, id )
    };

    @Delete("premise/:id")
    @HttpCode(HttpStatus.OK)
    async deletePremise( @Param("id") id : Uuid) {
        return this.projectsService.deletePremise(id)
    }

}


