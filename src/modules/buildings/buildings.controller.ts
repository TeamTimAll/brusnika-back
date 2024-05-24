import { Body, Controller , Get, Post , Param , Put, Delete , UploadedFiles, } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateBuilding } from '../buildings/dtos/building.create.dto';
import { UpdateBuilding } from '../buildings/dtos/building.update.dto';
import { Uuid } from 'boilerplate.polyfill';
import { ApiConsumes } from '@nestjs/swagger';
import path from 'path';
import { diskStorage } from "multer"
import {v4 as uuidv4  } from "uuid"
import { UseInterceptors  } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { BuildingsService } from './buildings.service';

@Controller('buildings')
@ApiTags("Buildings")
export class BuildingsController {
    constructor (
          private premiseService : BuildingsService
    ){}

      @Get()
      async getAllPremises(){
          return this.premiseService.getAllBuildings()
      }


     @Post()
     @ApiConsumes('multipart/form-data')
     @UseInterceptors(
      AnyFilesInterceptor({
          storage: diskStorage({
            destination: path.join(__dirname, '..', 'media'),
            filename: (_, file, cb) => {
                const uniqueId = uuidv4();
                const filename = `${uniqueId}-${file.originalname}`;
                cb(null, filename);
            }
           }),
        }
      )
    )
    
    async createNewPremise(
        @Body() newApartment: CreateBuilding, 
        @UploadedFiles() files: Array<Express.Multer.File>, 
    ){
             
              const fileNames  : string[] = files.map(file => file.filename);
               return this.premiseService.createBuilding(newApartment , fileNames )
     }


      @Put(":id")
      @ApiConsumes('multipart/form-data')
      @UseInterceptors(
       AnyFilesInterceptor({
           storage: diskStorage({
             destination: path.join(__dirname, '..', 'media'),
             filename: (_, file, cb) => {
                 const uniqueId = uuidv4();
                 const filename = `${uniqueId}-${file.originalname}`;
                 cb(null, filename);
             }
            }),
         }
       )
     )
      async updatePremise (
         @Body() updatePremise : UpdateBuilding,
         @Param("id") id : Uuid,
         @UploadedFiles() files ?: Array<Express.Multer.File>,
         ) {
            const fileNames  : string[] | undefined  = files?.map((each )=> each.filename)
            
          return this.premiseService.updateBuilding(updatePremise , id  , fileNames)
      }

      @Delete(":id")
      async deletePremise( @Param("id") id : Uuid) {
           return this.premiseService.deleteBuilding(id)
      }

}
