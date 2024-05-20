import { Body, Controller, Get, Post, Put , Delete, Param } from '@nestjs/common';
import { TrainingCreateDto } from './dtos/training.create.dto';
import { TrainingService } from './training.service';
import { Uuid } from 'boilerplate.polyfill';
import { UpdateTrainingDto } from "./dtos/train.update.dto";

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
    async createTraining ( @Body() trainingCreateDto : TrainingCreateDto ) {
        return this.trainingService.createTraining(trainingCreateDto)
    }


    @Put()
    async updateTraining ( @Body() updateTraining : UpdateTrainingDto ) {
          return this.trainingService.updateTraining(updateTraining)
    }

    @Delete(':id')
    async deleteTraining( @Param("id") id : Uuid) {
           return this.trainingService.deleteTraining(id)
    }


}
