import { Body, Controller, Get, Post, Put , Delete, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { TrainingCreateDto } from './dtos/training.create.dto';
import { TrainingService } from './training.service';
import { UpdateTrainingDto } from "./dtos/train.update.dto";
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

@Controller('training')
export class TrainingController {

    constructor(
              private trainingService : TrainingService
    ){}


    @Get()
    async getAllCourses(){
          return []
    }

    @Post()
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
              destination: './media',
              filename: (_, file, cb) => {
                const filename: string = uuidv4() + '-' + file.originalname;
                cb(null, filename);
              },
            }),
          }),
    )
    async createTraining (
     @UploadedFile() file : Express.Multer.File,
     @Body() trainingCreateDto : TrainingCreateDto ) {

        console.log({
              file
        });

        return this.trainingService.createTraining(trainingCreateDto , "New file url" )
    };

    @Put()
    async updateTraining ( @Body() updateTraining : UpdateTrainingDto ) {
          return this.trainingService.updateTraining(updateTraining)
    }

    @Delete(':id')
    async deleteTraining( @Param("id") id : string) {
           return this.trainingService.deleteTraining(id)
    }


}
