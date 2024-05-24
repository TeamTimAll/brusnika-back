import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CarParkingEntity } from './carParking.entity';
import { Repository } from 'typeorm';
import { CreateCarParkingDto } from './dtos/car-parking.create.dto';
import { Uuid } from 'boilerplate.polyfill';
import { UpdateCarParkingDto } from './dtos/car-parking.update.dto';
import { FilterCarParking } from "./dtos/car-parking.space.filter.dto"

@Injectable()
export class CarParkingsService {
    constructor(
        @InjectRepository(CarParkingEntity)
        private carParkingRepo : Repository<CarParkingEntity>
    ){}


    async getAll(){
        return  await this.carParkingRepo.find({
            relations : {
                building : true 
            }
        })
    }

    async createNewParking ( parkingBody : CreateCarParkingDto  , fileName :  string ) 
         :Promise<HttpException | CarParkingEntity>
    {
          try {

            return await this.carParkingRepo.save({
                ...parkingBody ,  photo : fileName
            })
            
          } catch (error) {
            
            console.log({
                  createParkingError : error 
            })

            return new HttpException("Something went wrong" , 500)
          }
    }


    async getOneParking ( id : Uuid ) {
            const carParking = await this.carParkingRepo.findOne({
                 where : { id },
                 relations : {
                      building : true 
                 }
            })


            return carParking
    }


    async deleteOneParking ( id : Uuid) : Promise<CarParkingEntity | HttpException>  {
           try {
            
            const parking = await this.getOneParking(id)

            if(!parking) return new HttpException("Car parking not found " , 404);
  
            return await this.carParkingRepo.remove(parking)
           } catch (error) {
               console.log({
                  carParkingDele : error 
               })
               return new HttpException("Something went wrong", 500)
           }
    }


 
    async updateCarParking( updateBody : UpdateCarParkingDto , id : Uuid , fileName ? : string ) 
     : Promise<CarParkingEntity | HttpException>
    {
             try {
                
                const carParking = await this.getOneParking(id)

                if(!carParking) return new HttpException("Car parking not found " , 404);

                let updated : CarParkingEntity

                if(!fileName) {
                      updated = await this.carParkingRepo.merge( carParking , updateBody)
                } else {
                     updated = await this.carParkingRepo.merge(carParking , {
                          ...updateBody , photo :  fileName
                     })
                }

                return updated 
             } catch (error) {
                console.log({
                      updateCarParkingError : error 
                })
                
                return new HttpException("Something went wrong" , 500)
             }
    }



    async filterCarParkings(filterDto: FilterCarParking): Promise<CarParkingEntity[]> {
        const queryBuilder = this.carParkingRepo.createQueryBuilder('parking_space'); 
      
        if (filterDto.status) {
          queryBuilder.andWhere('parking_space.status IN (:...statuses)', { statuses: [filterDto.status] });
        }
      
        if (filterDto.floor) {
          queryBuilder.andWhere('parking_space.floor = :floor', { floor: filterDto.floor });
        }
      
        if (filterDto.price) {
          queryBuilder.andWhere('parking_space.price LIKE :price', { price: `%${filterDto.price}%` });
        }
      
        return queryBuilder.getMany();
      }
      
} 


