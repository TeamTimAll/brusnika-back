import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BuildingsEntity } from './buildings.entity';
import { Repository } from 'typeorm';
import { Uuid } from 'boilerplate.polyfill';
import { CreateBuilding } from '../buildings/dtos/building.create.dto';
import { UpdateBuilding } from '../buildings/dtos/building.update.dto';
@Injectable()

export class BuildingsService  {
    constructor(
        @InjectRepository(BuildingsEntity)
        private buildingsRepo : Repository<BuildingsEntity>,
    ){}

    async getAllBuildings(){
           return await  this.buildingsRepo.find({
              relations : {
                  project : true ,
                  apartments : true
              }
           })
    }


    async createBuilding( building  : CreateBuilding , fileNames : string[] ) 
    : Promise<HttpException | BuildingsEntity> {
             try {

               const newBuilding=   await this.buildingsRepo.create({
                  ...building , photos : fileNames
               });

               return await this.buildingsRepo.save(newBuilding)
                
             } catch (error) {
                console.log({
                    createBuilding : error 
                });

                return new HttpException("Something went wrong", 500)
                
             }
    }

    async updateBuilding ( updateBuildingDto : UpdateBuilding  , id : Uuid  , fileNames ? : string[])
     : Promise<HttpException | BuildingsEntity> {
         
          try {


            let updatedBuilding : BuildingsEntity;
            const building = await this.getbuilding(id)

            if(!building) return new HttpException("Cannot find building", 404)  

           if(fileNames?.length === 0 ){
               updatedBuilding =   await this.buildingsRepo.merge( building , {
                  ...updateBuildingDto , photos : building.photos
               });  
           } else {
                updatedBuilding =   await this.buildingsRepo.merge(building , {
                ...updateBuildingDto ,  photos : fileNames
                });
           }
 
            await this.buildingsRepo.save(updatedBuilding)

            return updatedBuilding 
            
          } catch (error) {

            console.log({
                buildingUpdating : error 
            })

            return new HttpException("Something went wrong" , 500) 
            
          }
        
    }


    async getbuilding ( id : Uuid ) {
            const building = await this.buildingsRepo.findOne({
                 where : { id },
                 relations : {
                      project : true ,
                      apartments : true 
                 }
            });

            return building 
    }



    async deleteBuilding ( id : Uuid) : Promise<BuildingsEntity | HttpException> {
            try {

                const building = await this.getbuilding(id);
                if(!building)   return new HttpException("building not found " , 404)
                return  await this.buildingsRepo.remove(building)
                
            } catch (error : any ) {
                console.log({
                    deletetingBuilding : error 
                })

                return new HttpException("Something went wrong" , 500) 
                
            }
    }
 
}
