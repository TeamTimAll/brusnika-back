import { Body, Controller ,Get, Post , Put , HttpCode ,HttpStatus, Delete, Param } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { Uuid } from 'boilerplate.polyfill';

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
    async createClient( @Body() clientCreate : any ) {
        return this.clientService.createClient(clientCreate)
    }

    @Put()
    @HttpCode(HttpStatus.OK)
    async updateClient(@Body() updateClientDto : any ){
           return this.updateClient(updateClientDto)
    }

    @Delete(":id")
    @HttpCode(HttpStatus.OK)
    async deleteClient( @Param("id") id : Uuid) {
          return id 
    }





}
