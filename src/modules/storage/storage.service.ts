import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StorageEntity } from './storage.entity';
import { Repository } from 'typeorm';
import { StorageCreateDto } from './dtos/storage.create.dto';
import { StorageDto } from './dtos/storage.dto';
import { UpdateStorageDto } from './dtos/storage.update.dto';
import { FilterStorageDto } from './dtos/storage.filter.dto';

import { Uuid } from 'boilerplate.polyfill';

@Injectable()
export class StorageService {
    constructor(
        @InjectRepository(StorageEntity)
        private storageRepo : Repository<StorageEntity>
    ){}


    async getAll(){
        return this.storageRepo.find({
            relations :{
                  building : true 
            }
        })
   };



   async createNewStorage (  createNewStorage : StorageCreateDto , fileName : string )
     : Promise<HttpException | StorageDto>
   {
      try {

        const newStorage = await this.storageRepo.save({
            ...createNewStorage ,  photo: fileName
        })

        return newStorage
        
      } catch (error) {
        console.log({
               error : error 
        })
        return new HttpException("Something went wrong" , 500)
      }
   }


    async updateStorage( updateStorageDto : UpdateStorageDto ,  id : Uuid, fileName ? : string  ) 
      : Promise<HttpException | StorageDto>
    {
          
           try {

            const storage = await this.getOneStorage(id)

            if(!storage) return new HttpException("Storage not found " , 404);

            let updated;

            if(!fileName) {
                updated = await this.storageRepo.merge(storage , updateStorageDto)
            }  else {
                  updated = await this.storageRepo.merge(storage , {
                    ...updateStorageDto, photo : fileName
                  })
            }

            return  updated 
           } catch (error) {
            console.log({
                 updatingStorageError : error
            })
            return new HttpException("Something went wrong" , 500)
           };


    }

    async getOneStorage( id : Uuid) {
          return this.storageRepo.findOne({
              where : { id },
              relations : {
                  building : true 
              }
          })
    }


    async deleteOneStorage ( id : Uuid) : Promise<StorageDto | HttpException> {
           
        try {

            const storage = await this.getOneStorage(id)
            if(!storage ) return new HttpException("Storage not found" , 404);

            return await this.storageRepo.remove(storage)
            
        } catch (error) {
            console.log({
                  storageDeletingError : error 
            })
            return new HttpException("Something went wrong" , 500)
            
        }
    }


    async filterStorages(filterDto: FilterStorageDto): Promise<StorageEntity[]> {
        const queryBuilder = this.storageRepo.createQueryBuilder('storage');
        
        // Handle status with In operator
        if (filterDto.status) {
          queryBuilder.andWhere('storage.status IN (:...statuses)', { statuses: [filterDto.status] });
        }
      
        // Handle floor
        if (filterDto.floor) {
          queryBuilder.andWhere('storage.floor = :floor', { floor: filterDto.floor });
        }
      
        // Handle other fields dynamically
        const otherFields = ['price', 'size', 'storageNumber'];
        otherFields.forEach((field) => {
          if (filterDto[field]) {
            queryBuilder.andWhere(`storage.${field} LIKE :${field}`, { [field]: `%${filterDto[field]}%` });
          }
        });
      
        return queryBuilder.getMany();
      }
      
}


