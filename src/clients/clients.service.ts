import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientEntity } from '../modules/clients/client.entity';
import { Repository } from 'typeorm';
import { Uuid } from 'boilerplate.polyfill';
import { ClientDto } from "../modules/clients/dto/client.dto"
import { CreateClientDto } from "../modules/clients/dto/create.client.dto"
import { UpdateClientDto } from "../modules/clients/dto/client.update.dto"

@Injectable()
export class ClientsService {

    constructor( 
          @InjectRepository(ClientEntity)
           private clientRepository : Repository<ClientEntity>
    ){};

    async getAllClients() : Promise<ClientDto[]>{
          return await  this.clientRepository.find()
    }


    async createClient( clientCreateDto : CreateClientDto )  : Promise<ClientDto>{
          return await this.clientRepository.save(clientCreateDto)
    }

    async updateClient ( updateClientDto : UpdateClientDto ) : Promise<ClientDto | HttpException>{

        const client = await this.getOneClient(updateClientDto.id)
        if(!client) return new HttpException("Client not found" , 404)
       
        const updatedClient = await this.clientRepository.merge(client , updateClientDto)
        return updatedClient
          
    }



    async getOneClient(id: Uuid): Promise<ClientEntity | null> {
        const queryBuilder = this.clientRepository.createQueryBuilder('client')
          .where('client.id = :id', { id });
    
        const client = await queryBuilder.getOne();
        return client;
      }



    async deleteClient( id : Uuid) : Promise<ClientDto | HttpException> {
          const client = await this.getOneClient(id)

          if(!client) return new HttpException("Client not found " , 404);

          await this.clientRepository.remove(client)

          return client
    }


}  
