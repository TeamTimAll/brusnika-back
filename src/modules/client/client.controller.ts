import { Body, Controller, Get, Post , Put , Delete, Param  } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientCreateDto } from './dto/create.client.dto';
import { UpdateClientDto } from './dto/client.update.dto';
import { Uuid } from 'boilerplate.polyfill';
import { ClientFilterDto } from './dto/client.search.dto';
import { Auth } from '../../decorators';
import { RoleType } from '../../constants';

@Controller('client')
export class ClientController {
    constructor( private clientService : ClientService) {}

    @Get()
    // @Auth([RoleType.ADMIN , RoleType.USER]) // should be changed later 
    async  getAllCLients(){
          return this.clientService.getAllClients()
    }


    @Post()
    // @Auth([RoleType.ADMIN , RoleType.USER]) // should be changed later 
    async createClient(@Body() creatClientDto : ClientCreateDto) {
        return this.clientService.createClient(creatClientDto)
    }


    @Put()
    @Auth([RoleType.ADMIN , RoleType.USER]) // should be changed later 
    async updateClient( @Body() updateClientDto : UpdateClientDto ){
             return this.clientService.updateClient( updateClientDto)
    };


    @Delete(":id")
    @Auth([RoleType.ADMIN , RoleType.USER]) // should be changed later 
    async deleteClient( @Param("id") id : Uuid){
          return this.clientService.deleteClient(id)
    }   

    @Get(":id") 
    @Auth([RoleType.ADMIN , RoleType.USER]) // should be changed later 
    async getOneClient( @Param("id") id : Uuid){  
        return this.clientService.getOneClient(id)
    } 

    @Get("search")
    @Auth([RoleType.ADMIN , RoleType.USER]) // should be changed later 
    async filterClients( @Body() filterSearch : ClientFilterDto){
          return this.filterClients(filterSearch)
    }
}
