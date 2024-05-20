import { Body, Controller, Get, Post , Put , Delete, Param  } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create.client.dto';
import { UpdateClientDto } from './dto/client.update.dto';
import { Uuid } from 'boilerplate.polyfill';
// import { ClientSearchDto } from './dto/client.search.dto';

@Controller('client')
export class ClientController {
    constructor( private clientService : ClientService) {}

    @Get()
    async  getAllCLients(){
          return this.clientService.getAllClients()
    }


    @Post()
    async createClient(@Body() creatClientDto : CreateClientDto) {
        return this.clientService.createClient(creatClientDto)
    }


    @Put()
    async updateClient( @Body() updateClientDto : UpdateClientDto ){
             return this.clientService.updateClient( updateClientDto)
    }


    @Delete(":id")
    async deleteClient( @Param("id") id : Uuid){
          return this.clientService.deleteClient(id)
    }   

    @Get(":id") 
    async getOneClient( @Param("id") id : Uuid){  
        return this.clientService.getOneClient(id)
    } 

    @Get("search")
    async filterClients(){
        const dummy : any = {
            data :"34",
            identifier :"daysUntilEndOfAssignment"
          }
          
        return this.clientService.findClientBy(dummy)
    }


}
