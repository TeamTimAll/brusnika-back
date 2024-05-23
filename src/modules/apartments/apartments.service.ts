import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApartmentEntity } from './apartment.entity';
import { Repository } from 'typeorm';
import { Uuid } from 'boilerplate.polyfill';
import { ApartmentDto } from './dtos/apartment.dto';
import { ApartmentCreateDto } from './dtos/apartment.create.dto';
import { ApartmentUpdateDto } from './dtos/apartment.update.dto';


@Injectable()
export class ApartmentsService {

    constructor(
          @InjectRepository(ApartmentEntity)
          private apartmentsRepo : Repository<ApartmentEntity>
    ){}


    async getAllApartments() : Promise<ApartmentDto[]> {
          return  await this.apartmentsRepo.find( {
              relations : {
                  premise : true 
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

    async updateNewApartment( apartment : ApartmentUpdateDto , apartmentId : Uuid )
      : Promise<ApartmentDto | HttpException> {
               try {
                 
                    const foundApartment = await this.getOneApartment(apartmentId)
                    if(!foundApartment) return new HttpException("Cannot find apartment" , 404)
                    
                    const updated = await this.apartmentsRepo.merge(foundApartment , apartment)

                    return updated 
                
               } catch (error) {

                return new HttpException("Something went wrong" , 500)
                
               }
    }


    async  getOneApartment ( id : Uuid) {
      const apartment =    await this.apartmentsRepo.findOne({
             where : { id },
             relations : {
                  premise : true 
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


