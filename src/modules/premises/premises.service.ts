import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PremisesEntity } from './premise.entity';
import { Repository } from 'typeorm';
import { Uuid } from 'boilerplate.polyfill';

@Injectable()
export class PremisesService {
    constructor(
        @InjectRepository(PremisesEntity)
        private premiseRepo : Repository<PremisesEntity>
    ){}

    async getAllpremises(){
           return await  this.premiseRepo.find()
    }


    async createPremise( premise  : any ) {
             try {

                 await this.premiseRepo.save(premise)
                 return true
                
             } catch (error) {
                console.log({
                    createPremise : error 
                })
                return false
                
             }
    }

    async updatePremise ( updatePremiseDto : any ) : Promise<boolean> {
         
          try {

            const premise = await this.getPremise(updatePremiseDto.id)

            if(!premise) return false 
    
            await this.premiseRepo.merge(premise , updatePremiseDto)
    
            return true 
            
          } catch (error) {

            console.log({
                premiseUpdating : error 
            })

            return false 
            
          }
        
    }



    async getPremise ( id : Uuid ) {
            const premise = await this.premiseRepo.findOne({
                 where : { id }
            })
            return premise 
    }



    async deletePremise ( id : Uuid) {
            try {

                const premise = await this.getPremise(id);
                if(!premise) return false 


                await this.premiseRepo.remove(premise)

                return true 
                
            } catch (error) {
                console.log({
                    deletetingPremise : error
                })

                return false 
                
            }
    }

}
