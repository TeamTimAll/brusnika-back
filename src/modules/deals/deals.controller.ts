import { Body, Controller , Delete, Get, Param, Post, Put  } from '@nestjs/common';
import { DealsService } from './deals.service';
import { DealsCreateDto } from './dtos/deals.create.dto';
import { Uuid } from 'boilerplate.polyfill';

@Controller('deals')
export class DealsController {
    constructor ( private dealsService : DealsService){}


    @Get()
    async getAllDeals () {
        return this.dealsService.getAllDeals()
    }

    @Post()
    async createDeal ( @Body() dealsBody : DealsCreateDto ) {
          return await this.dealsService.createDeals(dealsBody)
    }

    @Put()
    async updateDeal ( @Body() updateBodyDeal : any ) {
          return this.dealsService.updateDeals(updateBodyDeal)
    }

    @Delete(":id")
    async deleteDeal (@Param("id") id : Uuid) {
           return this.dealsService.deleteOneDeal(id)
    }
}
