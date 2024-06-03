import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Put,
  Post,
  Delete,
  InternalServerErrorException,
  HttpException,
  Query,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { UUIDParam } from '../../decorators';
import { CreateCitiesDto } from './dtos/create-cities.dto';
import { CitiesDto } from './dtos/cities.dto';
import { UpdateCitiesDto } from './dtos/update-cities.dto';
import { CitiesService } from './cities.service';
import { Uuid } from 'boilerplate.polyfill';

@Controller('/cities')
@ApiTags('Cities')
export class CitiesController {
  constructor(private service: CitiesService) {}

  @ApiOperation({ summary: 'Create a city' })
  @ApiResponse({ status: HttpStatus.CREATED, type: CitiesDto })
  @Post()
  async createCity(@Body() createCitiesDto: CreateCitiesDto): Promise<any> {
    try {
      return await this.service.create(createCitiesDto);
    } catch (error: any) {
      throw this.handleException(error);
    }
  }

  @Get()
  @ApiQuery({
    name: 'name',
    description: ' city Name (optional if not provided  or empty)',
    required: false,
  })
  @ApiOperation({ summary: 'Get all cities' })
  @ApiResponse({ status: HttpStatus.OK })
  async getCities(@Query('name') name: string): Promise<any> {
    try {
      if (name) {
        return this.service.findAllWithName(name);
      } else {
        return await this.service.findAll();
      }
    } catch (error: any) {
      throw this.handleException(error);
    }
  }

  @ApiOperation({ summary: 'Get a single city by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: CitiesDto })
  @Get(':id')
  async getSingleCity(@UUIDParam('id') id: Uuid): Promise<any> {
    try {
      return await this.service.findOne(id);
    } catch (error: any) {
      throw this.handleException(error);
    }
  }

  @ApiOperation({ summary: 'Update a city by ID' })
  @ApiAcceptedResponse()
  @Put(':id')
  async updateCity(
    @UUIDParam('id') id: Uuid,
    @Body() updateCitiesDto: UpdateCitiesDto,
  ): Promise<any> {
    try {
      await this.service.update(id, updateCitiesDto);
    } catch (error: any) {
      throw this.handleException(error);
    }
  }

  @ApiOperation({ summary: 'Delete a city by ID' })
  @ApiAcceptedResponse()
  @Delete(':id')
  async deleteCity(@UUIDParam('id') id: Uuid): Promise<any> {
    try {
      await this.service.remove(id);
    } catch (error: any) {
      throw this.handleException(error);
    }
  }

  private handleException(error: any): HttpException {
    if (error.status) {
      return new HttpException(
        error.message ? error.message : error.response,
        error.status,
      );
    } else {
      console.error(error.message);
      return new InternalServerErrorException('Internal server error');
    }
  }
}
