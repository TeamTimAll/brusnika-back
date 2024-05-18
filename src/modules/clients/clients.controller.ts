import { Body, Controller ,Get, Post , Put , HttpCode ,HttpStatus, Delete, Param } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { Uuid } from 'boilerplate.polyfill';
import { CreateClientDto } from './dto/create.client.dto';
import { UpdateClientDto } from './dto/client.update.dto';

@Controller('clients')
export class ClientsController {
    constructor(  private clientService : ClientsService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async getAllClients(){
           return this.clientService.getAllClients()
    };

   @Post()
   @HttpCode(HttpStatus.CREATED)
    async createClient( @Body() clientCreate : CreateClientDto ) {
        return this.clientService.createClient(clientCreate)
    }

    @Put()
    @HttpCode(HttpStatus.OK)
    async updateClient(@Body() clientUpdateDto : UpdateClientDto ){
           return this.clientService.updateClient(clientUpdateDto)
    }

    @Delete(":id")
    @HttpCode(HttpStatus.OK)
    async deleteClient( @Param("id") id : Uuid) {
          return this.clientService.deleteClient(id)
    }



}
