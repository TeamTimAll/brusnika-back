import {  HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApartmentEntity } from './apartment.entity';
import { Repository } from 'typeorm';
import { Uuid } from 'boilerplate.polyfill';
import { ApartmentDto } from './dtos/apartment.dto';
import { ApartmentCreateDto } from './dtos/apartment.create.dto';
import { ApartmentUpdateDto } from './dtos/apartment.update.dto';
import { BuildingsService } from '../../modules/buildings/buildings.service';


@Injectable()
export class ApartmentsService {

    constructor(
          @InjectRepository(ApartmentEntity)
          private apartmentsRepo : Repository<ApartmentEntity>,
          private buildingService  : BuildingsService
    ){}


    async getAllApartments() : Promise<ApartmentDto[]> {
          return  await this.apartmentsRepo.find( {
              relations : {
                  building : true 
              }
          })
    }

    async createNewApartment ( newApartment : ApartmentCreateDto , fileNames : string[]  ) 
    : Promise<ApartmentDto | HttpException>{

        console.log({
             apartmentBody : newApartment
        });
        
          try {
             return await this.apartmentsRepo.save({
                ... newApartment , photos : fileNames 
             })

          } catch (error) {
            console.log({
                 error : error 
            })
               return new HttpException("Something went wrong" ,500)
          }
    }

    async updateNewApartment( apartment : ApartmentUpdateDto , apartmentId : Uuid , fileNames ? : string[] )
      : Promise<ApartmentDto | HttpException> {
               try {
                 
                    let updated ;


                    const premise = await this.buildingService.getbuilding(apartment.buildingId)

             if(!premise) return new HttpException("Premise not found", HttpStatus.NOT_FOUND)

                    const foundApartment = await this.getOneApartment(apartmentId)
                    if(!foundApartment) return new HttpException("Cannot find apartment" , 404)
                    
                    if(fileNames?.length === 0 ){
                         updated = await this.apartmentsRepo.merge(foundApartment , {
                              ...apartment , photos : foundApartment.photos
                         })
                    } else {
                         updated = await this.apartmentsRepo.merge(foundApartment , {
                              ...apartment , photos : fileNames
                         })
                    }

                    return updated 
                
               } catch (error) {

                return new HttpException("Something went wrong" , 500)
                
               }
    }


    async  getOneApartment ( id : Uuid) {
      const apartment =    await this.apartmentsRepo.findOne({
             where : { id },
             relations : {
                  building : true 
             }
        })

        return apartment
    }


    async deleteOneApartment ( id : Uuid ) : Promise<ApartmentDto | HttpException> {
           try {

            const apartment = await this.getOneApartment(id)
            if(!apartment) return new HttpException("Apartment not found " , 404)
            
            await this.apartmentsRepo.remove(apartment)

            return apartment
            
           } catch (error) {

            return new HttpException("Something went wrong" , 500)
            
           }
    }
}


