import { Body, Controller, Delete, Get , Param, Post, Put, UploadedFile  } from '@nestjs/common';
import { StorageService } from './storage.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiConsumes } from '@nestjs/swagger';
import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HttpCode, HttpStatus } from '@nestjs/common';
import { diskStorage } from "multer"
import { v4 as uuidv4} from "uuid";
import path from 'path';
import { Uuid } from 'boilerplate.polyfill';
import { StorageCreateDto } from './dtos/storage.create.dto';
import { UpdateStorageDto } from './dtos/storage.update.dto';

@Controller('storage')
@ApiTags("Storages")
export class StorageController {
    constructor(
        private storageService : StorageService
    ){}



    @Get()
    async getAll(){
          return this.storageService.getAll()
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
        @Body() storageCreateBody : StorageCreateDto ,
        @UploadedFile() file :Express.Multer.File

    ){
         
          return this.storageService.createNewStorage(storageCreateBody , file.filename)
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
        @Body() updateStorageBody : UpdateStorageDto ,
        @Param("id")  id : Uuid,
        @UploadedFile() file  ? : Express.Multer.File,

    ){
          return this.storageService.updateStorage(updateStorageBody , id , file?.filename)
    }

    @Delete(":id")
    async deleteStorage ( @Param("id") id : Uuid){
          return   this.storageService.deleteOneStorage(id)
    };
};


