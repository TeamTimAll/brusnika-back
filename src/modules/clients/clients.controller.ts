import { Controller } from '@nestjs/common';
import { ClientsService } from './clients.service';

@Controller('clients')
export class ClientsController {
    constructor(  private clientService : ClientsService) {}


    async getAllClients(){
           return this.clientService.getAllClients()
    };


    
}
