import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PremisesEntity } from './premise.entity';
import { Repository } from 'typeorm';
import { Uuid } from 'boilerplate.polyfill';
import { CreatePremisesDto } from './dtos/premise.create.dto';
import { UpdatePremiseDto } from './dtos/premise.update.dto';

@Injectable()

export class PremisesService {
    constructor(
        @InjectRepository(PremisesEntity)
        private premiseRepo : Repository<PremisesEntity>,
    ){}

    async getAllpremises(){
           return await  this.premiseRepo.find({
              relations : {
                  project : true ,
                  apartments : true
              }
           })
    }


    async createPremise( premise  : CreatePremisesDto , fileNames : string[] ) : Promise<HttpException | PremisesEntity> {
             try {

               const newPremise=   await this.premiseRepo.create({
                  ...premise , photos : fileNames
               });

               return await this.premiseRepo.save(newPremise)
                
             } catch (error) {
                console.log({
                    createPremise : error 
                });

                return new HttpException("Something went wrong", 500)
                
             }
    }

    async updatePremise ( updatePremiseDto : UpdatePremiseDto  , id : Uuid )
     : Promise<HttpException | PremisesEntity> {
         
          try {

            const premise = await this.getPremise(id)

            if(!premise) return new HttpException("Cannot find premise", 404)  
    
           const updatedPremise =   await this.premiseRepo.merge(premise , updatePremiseDto)
            await this.premiseRepo.save(updatedPremise)

            return updatedPremise 
            
          } catch (error) {

            console.log({
                premiseUpdating : error 
            })

            return new HttpException("Something went wrong" , 500) 
            
          }
        
    }


    async getPremise ( id : Uuid ) {
            const premise = await this.premiseRepo.findOne({
                 where : { id },
                 relations : {
                      project : true ,
                      apartments : true 
                 }
            });

            return premise 
    }



    async deletePremise ( id : Uuid) : Promise<PremisesEntity | HttpException> {
            try {

                const premise = await this.getPremise(id);
                if(!premise)   return new HttpException("Premise not found " , 404)
                return  await this.premiseRepo.remove(premise)
                
            } catch (error : any ) {
                console.log({
                    deletetingPremise : error 
                })

                return new HttpException("Something went wrong" , 500) 
                
            }
    }
 
}
