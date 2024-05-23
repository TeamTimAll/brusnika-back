import { Body, Controller, Delete, Get  , Param, Post  , Put, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApartmentsService } from './apartments.service';
import { ApiTags ,ApiConsumes } from '@nestjs/swagger';
import { ApartmentCreateDto } from './dtos/apartment.create.dto';
import { ApartmentUpdateDto } from './dtos/apartment.update.dto';
import { Uuid } from 'boilerplate.polyfill';
import {  AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from "multer"
import {v4 as uuidv4  } from "uuid"
import path from 'path';

@Controller('apartments')
@ApiTags("Apartments")
export class ApartmentsController {

    constructor (
          private apartmentService : ApartmentsService
     ){}

     @Get()
     async getAllPartments ( ) {
          return this.apartmentService.getAllApartments()
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
    async createNewApartment(
        @Body() newApartment: ApartmentCreateDto, 
        @UploadedFiles() files: Array<Express.Multer.File>, 
    ){
             const fileNames  : string[] = files.map(file => file.filename);
               return this.apartmentService.createNewApartment(newApartment , fileNames )
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
     async updateApartment ( 
        @Body()  apartment : ApartmentUpdateDto , 
        @Param("id") id : Uuid,
        @UploadedFiles() files ? :  Array<Express.Multer.File>
    )  {
            const fileNames : string[] | undefined = files?.map((each ) => each.filename)
            return this.apartmentService.updateNewApartment(apartment , id , fileNames )
       }

    @Get("one/:id")
    async getApartment( @Param("id") id : Uuid) {
           return this.apartmentService.getOneApartment(id)
    }

    @Delete(":id")
    async deleteApartment ( @Param("id") id : Uuid) {
           return this.apartmentService.deleteOneApartment(id)
    };

}
