import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommercialBuildingsEntity } from "./commercial.entity"
import { Repository } from 'typeorm';
import {  CommercialCreateDto } from "./dtos/commercial.create.dto"
import { CommercialDto } from "./dtos/commercial.dto"
import { CommercialUpdateDto } from "./dtos/commercial.update.dto"
import { CommercaialFilterDto } from "./dtos/commercial.filter.dto"
import { Uuid } from 'boilerplate.polyfill';

@Injectable()
export class CommercialBuildingsService  {
    constructor(
        @InjectRepository(CommercialBuildingsEntity)
        private commercailRepo : Repository<CommercialBuildingsEntity>
    ){}


    async getAll(){
        return this.commercailRepo.find({
            relations :{
                  building : true 
            }
        })
   };



   async createNewStorage (  createnewCommercail : CommercialCreateDto , fileName : string )
     : Promise<HttpException | CommercialDto>
   {
      try {

        const newStorage = await this.commercailRepo.save({
            ...createnewCommercail ,  photo: fileName
        })

        return newStorage
        
      } catch (error) {
        console.log({
               error : error 
        })
        return new HttpException("Something went wrong" , 500)
      }
   }


    async updateStorage( updateStorageDto : CommercialUpdateDto ,  id : Uuid, fileName ? : string  ) 
      : Promise<HttpException | CommercialDto>
    {
          
           try {

            const storage = await this.getOneStorage(id)

            if(!storage) return new HttpException("Storage not found " , 404);

            let updated;

            if(!fileName) {
                updated = await this.commercailRepo.merge(storage , updateStorageDto)
            }  else {
                  updated = await this.commercailRepo.merge(storage , {
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
          return this.commercailRepo.findOne({
              where : { id },
              relations : {
                  building : true 
              }
          })
    }


    async deleteOneStorage ( id : Uuid) : Promise<CommercialDto | HttpException> {
           
        try {

            const storage = await this.getOneStorage(id)
            if(!storage ) return new HttpException("Storage not found" , 404);

            return await this.commercailRepo.remove(storage)
            
        } catch (error) {
            console.log({
                  storageDeletingError : error 
            })
            return new HttpException("Something went wrong" , 500)
            
        }
    }


    async filterStorages(filterDto: CommercaialFilterDto): Promise<CommercialDto[]> {
        const queryBuilder = this.commercailRepo.createQueryBuilder('storage');
        
        // Handle status with In operator
        if (filterDto.status) {
          queryBuilder.andWhere('storage.status IN (:...statuses)', { statuses: [filterDto.status] });
        }
      
        // Handle floor
        if (filterDto.floor) {
          queryBuilder.andWhere('storage.floor = :floor', { floor: filterDto.floor });
        }
      
        
        const otherFields = ['price', 'size', 'commercialNumber'];
        otherFields.forEach((field) => {
          if (filterDto[field]) {
            queryBuilder.andWhere(`storage.${field} LIKE :${field}`, { [field]: `%${filterDto[field]}%` });
          }
        });
      
        return queryBuilder.getMany();
      }
      
}


