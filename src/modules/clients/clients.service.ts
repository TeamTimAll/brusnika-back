import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientEntity } from './client.entity';
import { Repository } from 'typeorm';
import { Uuid } from 'boilerplate.polyfill';
import { ClientDto } from './dto/client.dto';
import { CreateClientDto } from './dto/create.client.dto';
import { UpdateClientDto } from './dto/client.update.dto';

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

    async updateClient ( clientUpdateDto : UpdateClientDto ) : Promise<ClientDto | HttpException>{

        const client = await this.getOneClient(clientUpdateDto.clientId)
        if(!client) return new HttpException("Client not found" , 404)
       
        const updatedClient = await this.clientRepository.merge(client , clientUpdateDto)
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
