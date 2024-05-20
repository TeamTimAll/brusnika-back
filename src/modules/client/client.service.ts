import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientEntity } from  "./client.entity"
import { Repository } from 'typeorm';
import { Uuid } from 'boilerplate.polyfill';
import { UpdateClientDto } from './dto/client.update.dto';
import { ClientFilterDto } from './dto/client.search.dto';
import { ClientStatusService } from '../../modules/client-status/client-status.service';
import { IClientStatusCreatedType } from "../../types/client.types"
import { ClientCreateDto } from './dto/create.client.dto';


@Injectable()
export class ClientService {

    constructor( 
          @InjectRepository(ClientEntity)
           private clientRepository : Repository<ClientEntity>,
           private clientStatusService : ClientStatusService
    ){};

    async getAllClients() : Promise<any[]>{
          return await  this.clientRepository.find({
              relations : {
                  pinningType : true
              }
          })
    }

    async createClient( clientCreateDto : ClientCreateDto  )  : Promise<ClientEntity | HttpException>{
           try{
               
               const newClient =  await this.clientRepository.save(clientCreateDto)
              
               if(!newClient) return new HttpException("Cannot create client " , 500)
         
               const clientStatusType  : IClientStatusCreatedType  = await this.clientStatusService.createClientStatus({
                clientId : newClient.id,
                type : "lead verification"
               })
              

               if(clientStatusType.success === false  ) {
                console.log(clientStatusType?.error_reason)
                 return new  HttpException("Cannot create client status" , 500)
               };


               if(!clientStatusType.clientStatus) {
                console.log("Cannot get client status")
                return new HttpException("Something went wrong" , 500);
               }


               newClient.pinningType = clientStatusType.clientStatus

               return await  this.clientRepository.save(newClient)

           }catch ( error : any ){
             console.log({
                error 
             })

             return new HttpException(error.message , 500)
           }
    }

    async updateClient ( clientUpdateDto : UpdateClientDto ) : Promise<ClientEntity | HttpException>{

        const client = await this.getOneClient(clientUpdateDto.clientId)
        if(!client) return new HttpException("Client not found" , 404)
            
       
        const updatedClient = await this.clientRepository.merge(client , clientUpdateDto)
        
        return  await this.clientRepository.save(updatedClient)
          
    }

    async getOneClient(id: Uuid): Promise<ClientEntity | null> {
      const queryBuilder = this.clientRepository 
      .createQueryBuilder('client')
       .leftJoinAndSelect('client.pinningType', 'clientStatus')
      .where('client.id = :id', { id })
      .select(['client', 'clientStatus'])
    
        const client = await queryBuilder.getOne()
        console.log(client)
        return client;
      }

    async deleteClient( id : Uuid) : Promise<ClientEntity | HttpException> {
           try {
            const client = await this.getOneClient(id)

            if(!client) return new HttpException("Client not found " , 404);
  
            await this.clientRepository.softDelete(id);
  
            return client
           } catch (error : any ) {
                 return new HttpException(error.message , 500)
           }
    };


     async findClients(filterDto: ClientFilterDto): Promise<ClientEntity[]> {
        const queryBuilder = this.clientRepository.createQueryBuilder('clients');
    
        if (filterDto.fullName) {
          queryBuilder.andWhere('clients.fullName LIKE :fullName', { fullName: `%${filterDto.fullName}%` });
        }
    
        if (filterDto.phoneNumber) {
          queryBuilder.andWhere('clients.phoneNumber LIKE :phoneNumber', { phoneNumber: `%${filterDto.phoneNumber}%` });
        }
    
        if (filterDto.projectId) {
          queryBuilder.andWhere('clients.projectId = :projectId', { projectId: filterDto.projectId });
        }
    
        if (filterDto.establishmentDateFrom) {
          queryBuilder.andWhere('clients.establishmentDate >= :establishmentDateFrom', { establishmentDateFrom: filterDto.establishmentDateFrom });
        }
    
        if (filterDto.establishmentDateTo) {
          queryBuilder.andWhere('clients.establishmentDate <= :establishmentDateTo', { establishmentDateTo: filterDto.establishmentDateTo });
        }
    
        if (filterDto.transactionStatus) {
          queryBuilder.andWhere('clients.transactionStatus = :transactionStatus', { transactionStatus: filterDto.transactionStatus });
        }
    
        if (filterDto.transactionStage) {
          queryBuilder.andWhere('clients.transactionStage = :transactionStage', { transactionStage: filterDto.transactionStage });
        }
    
        if (filterDto.active !== undefined) {
          if (filterDto.active) {
            queryBuilder.andWhere('clients.transactionStatus NOT IN (:...inactiveStatuses)', { inactiveStatuses: ['paused', 'lost'] });
          } else {
            queryBuilder.andWhere('clients.transactionStatus IN (:...inactiveStatuses)', { inactiveStatuses: ['paused', 'lost'] });
          }
        }
    
          const clients = await queryBuilder.getMany();

        if (clients.length === 0) {
            throw new HttpException('No clients found',404);
        }

         return clients 
      }
    }


