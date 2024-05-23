import { Body, Controller , Get, Post , Param , Put, Delete , UploadedFiles } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PremisesService } from './premises.service';
import { CreatePremisesDto } from './dtos/premise.create.dto';
import { UpdatePremiseDto } from './dtos/premise.update.dto';
import { Uuid } from 'boilerplate.polyfill';
import { ApiConsumes } from '@nestjs/swagger';
import path from 'path';
import { diskStorage } from "multer"
import {v4 as uuidv4  } from "uuid"
import { UseInterceptors  } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('premises')
@ApiTags("premises")
export class PremisesController {
    constructor (
          private premiseService : PremisesService
    ){}

      @Get()
      async getAllPremises(){
          return this.premiseService.getAllpremises()
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
        @Body() newApartment: CreatePremisesDto, 
        @UploadedFiles() files: Array<Express.Multer.File>, 
    ){
             
              const fileNames  : string[] = files.map(file => file.filename);
               return this.premiseService.createPremise(newApartment , fileNames )
     }


      @Put(":id")
      async updatePremise (
         @Body() updatePremise : UpdatePremiseDto,
         @Param("id") id : Uuid
         ) {
          return this.premiseService.updatePremise(updatePremise , id )
      }

      @Delete(":id")
      async deletePremise( @Param("id") id : Uuid) {
           return this.premiseService.deletePremise(id)
      }

}
