import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApartmentEntity } from './apartment.entity';
import { Repository } from 'typeorm';
import { Uuid } from 'boilerplate.polyfill';

@Injectable()
export class ApartmentsService {

    constructor(
          @InjectRepository(ApartmentEntity)
          private apartmentsRepo : Repository<ApartmentEntity>
    ){}


    async getAllApartments() {
          return  await this.apartmentsRepo.find()
    }

    async createNewApartment ( newApartment : any ){
        return await this.apartmentsRepo.save(newApartment)
    }

    async updateNewApartment( apartment : any , id : Uuid ) {
             
             const foundApartment = await this.getOneApartment(id)
             if(!foundApartment) return new HttpException("Cannot find apartment" , 404)
            
              const updated = await this.apartmentsRepo.merge(foundApartment , apartment)

              return updated 

    }



    async  getOneApartment ( id : Uuid) {
      const apartment =    await this.apartmentsRepo.findOne({
             where : { id }
        })


        return apartment
    }
}
