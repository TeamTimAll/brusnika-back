import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientStatusEntity } from './client-status.entity';
import { Repository } from 'typeorm';
import { IClientCreateStatus , IClientStatusCreatedType } from "../../types/client.types"



@Injectable()
export class ClientStatusService {
    constructor (
        @InjectRepository(ClientStatusEntity)
        private statusRepo : Repository<ClientStatusEntity>

    ){}



    async createClientStatus(clientStatus : IClientCreateStatus)
     : Promise<IClientStatusCreatedType> {
              try {

                const newStatus = await this.statusRepo.save(clientStatus)

                const response :   IClientStatusCreatedType  = {
                           success : true,
                           clientStatus: newStatus
                } 

                return response 
                
              } catch (error : any ) {
               
                const errorStatus : IClientStatusCreatedType = {
                       success : false ,
                       error_reason : error.message 
                }
                
                return errorStatus
              }
    }
}
