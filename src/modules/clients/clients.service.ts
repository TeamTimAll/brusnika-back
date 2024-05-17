import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientEntity } from './client.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClientsService {

    constructor( 
          @InjectRepository(ClientEntity)
           private clientService : Repository<ClientEntity>
    ){}

    async getAllClients(){
          return this.clientService.find()
    }


    

}  
