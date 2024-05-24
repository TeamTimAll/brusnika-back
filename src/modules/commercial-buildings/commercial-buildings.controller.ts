import { Body, Controller, Delete, Get , Param, Post, Put, UploadedFile  } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiConsumes } from '@nestjs/swagger';
import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HttpCode, HttpStatus } from '@nestjs/common';
import { diskStorage } from "multer"
import { v4 as uuidv4} from "uuid";
import path from 'path';
import { Uuid } from 'boilerplate.polyfill';
import { CommercialCreateDto } from "./dtos/commercial.create.dto"
import { CommercialUpdateDto } from "./dtos/commercial.update.dto"
import { CommercaialFilterDto } from "./dtos/commercial.filter.dto"
import { CommercialBuildingsService } from './commercial-buildings.service';

@Controller('commercial-buildings')
@ApiTags("Commercial-buildings")
export class CommercialBuildingsController {
    constructor(
        private commercialService  : CommercialBuildingsService
    ){}


    @Get()
    async getAll(){
          return this.commercialService.getAll()
    }

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
    async createNewStorage(
        @Body() storageCreateBody : CommercialCreateDto ,
        @UploadedFile() file :Express.Multer.File

    ){
         
          return this.commercialService.createNewStorage(storageCreateBody , file.filename)
    }


    @Put("id")
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
    async updateStorage(
        @Body() updateStorageBody : CommercialUpdateDto ,
        @Param("id")  id : Uuid,
        @UploadedFile() file  ? : Express.Multer.File,

    ){
          return this.commercialService.updateStorage(updateStorageBody , id , file?.filename)
    }

    @Delete(":id")
    async deleteStorage ( @Param("id") id : Uuid){
          return   this.commercialService.deleteOneStorage(id)
    };

    @Post("filter")
    async filterStorage ( @Body()  filterBody : CommercaialFilterDto ){
          return this.commercialService.filterStorages(filterBody)
    }
};


