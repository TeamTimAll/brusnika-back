import { Body, Controller , Delete, Get, Param, Post, Put  } from '@nestjs/common';
import { DealsService } from './deals.service';
import { DealsCreateDto } from './dtos/deals.create.dto';
import { Uuid } from 'boilerplate.polyfill';
import { UpdateDealsDto } from './dtos/deals.update.dto';

@Controller('deals')
export class DealsController {
    constructor ( private dealsService : DealsService){}

    @Get()
    async getAllDeals () {
        return this.dealsService.getAllDeals()
    }


    @Get(":id")
    async getOneDeal(@Param("id") id : Uuid) {
           return this.dealsService.getOneDeal(id)  
    }


    @Post()
    async createDeal ( @Body() dealsBody : DealsCreateDto ) {
          return  this.dealsService.createDeals(dealsBody)
    }


    @Put(":id")
    async updateDeal ( @Body() updateBodyDeal : UpdateDealsDto, 
     @Param("id") id : Uuid ) 
    {
          return this.dealsService.updateDeals(updateBodyDeal , id )
    }

    @Delete(":id")
    async deleteDeal (@Param("id") id : Uuid) {
           return this.dealsService.deleteOneDeal(id)
    }
}
