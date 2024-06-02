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
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiOperation,
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
  constructor(private citiesService: CitiesService) {}

  @ApiOperation({ summary: 'Create a city' })
  @ApiResponse({ status: HttpStatus.CREATED, type: CitiesDto })
  @Post()
  async createCity(@Body() createCitiesDto: CreateCitiesDto): Promise<any> {
    try {
      return await this.citiesService.create(createCitiesDto);
    } catch (error: any) {
      throw this.handleException(error);
    }
  }

  @ApiOperation({ summary: 'Get all cities' })
  @ApiResponse({ status: HttpStatus.OK, type: CitiesDto, isArray: true })
  @Get()
  async getCities(): Promise<any> {
    try {
      return await this.citiesService.findAll();
    } catch (error: any) {
      throw this.handleException(error);
    }
  }

  @ApiOperation({ summary: 'Get a single city by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: CitiesDto })
  @Get(':id')
  async getSingleCity(@UUIDParam('id') id: Uuid): Promise<any> {
    try {
      return await this.citiesService.findOne(id);
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
      await this.citiesService.update(id, updateCitiesDto);
    } catch (error: any) {
      throw this.handleException(error);
    }
  }

  @ApiOperation({ summary: 'Delete a city by ID' })
  @ApiAcceptedResponse()
  @Delete(':id')
  async deleteCity(@UUIDParam('id') id: Uuid): Promise<any> {
    try {
      await this.citiesService.remove(id);
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
