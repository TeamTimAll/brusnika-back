import { Body, Controller, Get, Post , Put , Delete, Param  } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientCreateDto } from './dto/create.client.dto';
import { UpdateClientDto } from './dto/client.update.dto';
import { Uuid } from 'boilerplate.polyfill';
import { ClientFilterDto } from './dto/client.search.dto';

@Controller('client')
export class ClientController {
    constructor( private clientService : ClientService) {}

    @Get()
    async  getAllCLients(){
          return this.clientService.getAllClients()
    }


    @Post()
    async createClient(@Body() creatClientDto : ClientCreateDto) {
        return this.clientService.createClient(creatClientDto)
    }


    @Put()
    async updateClient( @Body() updateClientDto : UpdateClientDto ){
             return this.clientService.updateClient( updateClientDto)
    };


    @Delete(":id")
    async deleteClient( @Param("id") id : Uuid){
          return this.clientService.deleteClient(id)
    }   

    @Get(":id") 
    async getOneClient( @Param("id") id : Uuid){  
        return this.clientService.getOneClient(id)
    } 

    @Get("search")
    async filterClients( @Body() filterSearch : ClientFilterDto){
          return this.filterClients(filterSearch)
    }
}
