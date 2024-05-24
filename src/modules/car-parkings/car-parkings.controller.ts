import { Controller, Get , Post , Body , UploadedFile, Put, Param, Delete  } from '@nestjs/common';
import { CarParkingsService } from './car-parkings.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateCarParkingDto } from './dtos/car-parking.create.dto';
import { ApiConsumes  } from '@nestjs/swagger';
import {  diskStorage } from "multer"
import { UseInterceptors  } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import path from 'path';
import {v4 as uuidv4  } from "uuid"
import { HttpCode , HttpStatus } from '@nestjs/common';
import { UpdateCarParkingDto } from './dtos/car-parking.update.dto';
import { Uuid } from 'boilerplate.polyfill';

@Controller('car-parkings')
@ApiTags("Car Parking")
export class CarParkingsController {
    constructor(
          private carParkingService : CarParkingsService
    ){}

    @Get()
    async getAllCarParking(){
        return this.carParkingService.getAll()
    };

    @Post()
    @ApiConsumes('multipart/form-data')
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
        @Body() projectDto: CreateCarParkingDto,
        @UploadedFile()  file : Express.Multer.File 
    ) {
        return this.carParkingService.createNewParking(projectDto , file.filename);
    }

    @Put(":id")
    @ApiConsumes('multipart/form-data')
    @HttpCode(HttpStatus.OK)
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
    async updateCarParking( 
        @Body()  updateParkingBody : UpdateCarParkingDto,
        @Param("id") id : Uuid,
        @UploadedFile() file  ? : Express.Multer.File,
    ){
           return this.carParkingService.updateCarParking(updateParkingBody , id , file?.filename)
    }

    @Delete("id")
    @HttpCode(200)
    async deleteCarParking ( @Param("id") id : Uuid) {
         return this.carParkingService.deleteOneParking(id)
    };
    
};




