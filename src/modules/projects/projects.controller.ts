import { Body, Controller , Delete, Get, HttpCode, HttpStatus , Param, Post, Put, UploadedFile   } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Uuid } from 'boilerplate.polyfill';
import { CreateProjectDto } from './dto/project.create.dto';
import { UpdateProjectDto } from  "./dto/projects.update.dto"
// import { UseInterceptors } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';

@Controller('projects')
export class ProjectsController {

    constructor ( private projectsService : ProjectsService){ }

    @Get()
    @HttpCode(HttpStatus.OK)
    async getAllProjects(){
        return this.projectsService.getAllProjects()
    }

    @Post()
    // @UseInterceptors(FileInterceptor("file" , {
             
    // }))
    @HttpCode(HttpStatus.CREATED)
    async createProject( 
        @UploadedFile() file : Express.Multer.File,

        @Body()  projectDto : CreateProjectDto ){
            console.log(file);

          return this.projectsService.createProjects(projectDto)
    };


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
}


