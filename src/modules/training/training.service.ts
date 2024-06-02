import { HttpException, Injectable } from '@nestjs/common';
import { TrainingEntity } from './training.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrainingCreateDto } from './dtos/training.create.dto';
import { Uuid } from 'boilerplate.polyfill';


@Injectable()
export class TrainingService {
    constructor (
         @InjectRepository(TrainingEntity)
         private trainingRepo  : Repository<TrainingEntity>
    ){}



    async getAllTraining(){
          return this.trainingRepo.find()
    };

    async createTraining( trainingCreate : TrainingCreateDto , fileName : string ) 
    : Promise<HttpException | TrainingEntity>

    {

          try {
               
            return await this.trainingRepo.save({
                    ...trainingCreate, imageUrl : fileName
            })
          } catch (error : any ) {
              return new HttpException(error.message , 500)
          }
    }


       async getOneTraining( id : Uuid) : Promise<TrainingEntity | null>{

        try {

            const queryBuilder = await this.trainingRepo.createQueryBuilder("traning")
            .where("traning.id = :id" , {id})
            const training = await queryBuilder.getOne()

            if(!training) throw  new HttpException("Training not found " , 404)

            return training
        } catch (error : any ) {
            throw  new HttpException(error.message , 500)
            
        }
       }



       async updateTraining( trainingUpdate : any ) : Promise<TrainingEntity | HttpException>{

             try {

                const training = await this.getOneTraining(trainingUpdate.id);

                if(!training) return new HttpException("Training not found " , 404);

                await this.trainingRepo.merge(training , trainingUpdate)

                return trainingUpdate
                
             } catch (error) {
                console.log({
                      error 
                })
                return new HttpException("Something went wrong " , 500)
             }
       }




       async deleteTraining ( id : Uuid) {
             try {


                const training = await this.getOneTraining(id)


                if(!training) return new HttpException("Training not found " , 404)

                await this.trainingRepo.remove(training)


                return training
                
             } catch (error : any ) {

                console.log({
                     error
                })

                return new HttpException(error.message , 500)
                
             }
       }

}

