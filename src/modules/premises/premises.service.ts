import { Injectable } from '@nestjs/common';
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
        private premiseRepo : Repository<PremisesEntity>
    ){}

    async getAllpremises(){
           return await  this.premiseRepo.find()
    }


    async createPremise( premise  : CreatePremisesDto ) : Promise<boolean | PremisesEntity> {
             try {

               const newPremise=   await this.premiseRepo.create(premise);
               return await this.premiseRepo.save(newPremise)
                
             } catch (error) {
                console.log({
                    createPremise : error 
                });

                return false
                
             }
    }

    async updatePremise ( updatePremiseDto : UpdatePremiseDto  , id : Uuid )
     : Promise<boolean | PremisesEntity> {
         
          try {

            const premise = await this.getPremise(id)

            if(!premise) return false 
    
           const updatedPremise =   await this.premiseRepo.merge(premise , updatePremiseDto)
            await this.premiseRepo.save(updatedPremise)

            return updatedPremise 
            
          } catch (error) {

            console.log({
                premiseUpdating : error 
            })

            return false 
            
          }
        
    }



    async getPremise ( id : Uuid ) {
            const premise = await this.premiseRepo.findOne({
                 where : { id },
                 relations : {
                      project : true 
                 }
            });

            return premise 
    }



    async deletePremise ( id : Uuid) : Promise<PremisesEntity | boolean> {
            try {

                const premise = await this.getPremise(id);
                if(!premise) return false 


                await this.premiseRepo.remove(premise)

                return premise  
                
            } catch (error) {
                console.log({
                    deletetingPremise : error
                })

                return false 
                
            }
    }

}
