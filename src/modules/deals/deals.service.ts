import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DealsEntity } from './deals.entity';
import { Repository } from 'typeorm';
import { DealsCreateDto } from './dtos/deals.create.dto';
import { Uuid } from 'boilerplate.polyfill';
// import { DealsUpdateDto } from './dtos/deals.update.dto';


@Injectable()
export class DealsService {

    constructor(
               @InjectRepository(DealsEntity)
              private   dealsRepo :  Repository<DealsEntity>
    ){}


    async getAllDeals() : Promise<DealsEntity[]>{
             return  this.dealsRepo.find()
    }


    async createDeals ( dealsCreateDto : DealsCreateDto) 
    : Promise<DealsEntity | HttpException> {
        try {
            
            return await  this.dealsRepo.save(dealsCreateDto)

        } catch (error) {

            console.log({
                  dealsBug : error 
            })

            return new HttpException("Something went wrong" , 500)
            
        }
      }

      async updateDeals( dealsUpdate : any  ) 
      : Promise<DealsEntity | HttpException>{
      
        try {

            const deals = await this.getOneDeal(dealsUpdate.id)
            if(!deals) return new HttpException("Cannot find the deal" , 404)
            
            const updatedDeal = await this.dealsRepo.merge(deals, dealsUpdate)
            return updatedDeal
            
        } catch (error) {
            return new HttpException("Something went wrong " , 500)
        }
      }



      async deleteOneDeal( id : Uuid ) {
          try {
                const deals = await this.getOneDeal(id)

                if(!deals) return new HttpException("Deals not found " , HttpStatus.NOT_FOUND)
                await this.dealsRepo.remove(deals)

                return deals 

          } catch (error) {
            console.log({
                  dealsDelete : error
            })

            return new HttpException("Something went wrong " , 500)
            
          }



      }


      async getOneDeal( id : Uuid)  : Promise<null | DealsEntity>{
          const query = await this.dealsRepo.createQueryBuilder("Deals")
          .where("deal.id = :id" , { id })

          const deal = await query.getOne();
          return deal
      }

}
