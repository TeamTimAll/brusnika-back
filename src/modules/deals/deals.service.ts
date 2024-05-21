import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DealsEntity } from './deals.entity';
import { Repository } from 'typeorm';
import { DealsCreateDto } from './dtos/deals.create.dto';
import { Uuid } from 'boilerplate.polyfill';
import { UpdateDealsDto } from './dtos/deals.update.dto';
import { ClientService } from '../../modules/client/client.service';
import { DealsFilterResponse } from "../../types/deal.types"

@Injectable()
export class DealsService {

    constructor(
             @InjectRepository(DealsEntity)
              private   dealsRepo :  Repository<DealsEntity>,
              private readonly  clientService :  ClientService
    ){}

 
    async getAllDeals() : Promise<DealsEntity[]>{
             return  await  this.dealsRepo.find()
    }


    async createDeals ( dealsCreateDto : DealsCreateDto) 
    : Promise<DealsEntity | HttpException> {
        try {

            const client  = await this.clientService.getOneClient(dealsCreateDto.clientId)

            if(!client) return new HttpException("Client not found " , 404)
              

            return await  this.dealsRepo.save({
                  ...dealsCreateDto ,  
                  clientFullName : client.fullName,
                   clientPhoneNumber : client.phoneNumber
            })

        } catch (error) {
            return new HttpException("Something went wrong" , 500)
            
        }
      }

      async updateDeals( dealsUpdate : UpdateDealsDto , id : Uuid  ) 
      : Promise<DealsEntity | HttpException>{
      
        try {

            const deals = await this.getOneDeal(id)
            if(!deals) return new HttpException("Cannot find the deal" , 404)
            
            const updatedDeal = await this.dealsRepo.merge(deals, dealsUpdate)
            await this.dealsRepo.save(updatedDeal)
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


      async getOneDeal(id: Uuid): Promise<null | DealsEntity> {
        const deal = await this.dealsRepo.findOne({
            where: { id },
            relations: ["project", "client"] 
          });
        return deal;
      }


      async dealsStatusFilter ()  : Promise<DealsFilterResponse | HttpException>{
            try {
                const lost : DealsEntity[] = await this.getDealsByStatus("won")
                const won  : DealsEntity[]  = await this.getDealsByStatus("lost")

                return {
                        lost ,
                         won
                }

            } catch (error : any ) {
                console.log({
                      filter : error.message
                })
                return new HttpException("Something went wrong" , 500)
                
            }
      }

      async getDealsByStatus(status: string): Promise<DealsEntity[]> {
        return  await this.dealsRepo.find({
            where: { transactionStatus: status },
          });

      } 
    
      

}
