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
import { CreateSectionsDto } from './dtos/create-sections.dto';
import { SectionsDto } from './dtos/sections.dto';
import { UpdateSectionsDto } from './dtos/update-sections.dto';
import { SectionsService } from './sections.service';
import { Uuid } from 'boilerplate.polyfill';

@Controller('/sections')
@ApiTags('Sections')
export class SectionsController {
  constructor(private SectionsService: SectionsService) {}

  @ApiOperation({ summary: 'Create a city' })
  @ApiResponse({ status: HttpStatus.CREATED, type: SectionsDto })
  @Post()
  async createCity(@Body() createSectionsDto: CreateSectionsDto): Promise<any> {
    try {
      return await this.SectionsService.create(createSectionsDto);
    } catch (error: any) {
      throw this.handleException(error);
    }
  }

  @ApiOperation({ summary: 'Get all Sections' })
  @ApiResponse({ status: HttpStatus.OK, type: SectionsDto, isArray: true })
  @Get()
  async getSections(): Promise<any> {
    try {
      return await this.SectionsService.findAll();
    } catch (error: any) {
      throw this.handleException(error);
    }
  }

  @ApiOperation({ summary: 'Get a single city by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: SectionsDto })
  @Get(':id')
  async getSingleCity(@UUIDParam('id') id: Uuid): Promise<any> {
    try {
      return await this.SectionsService.findOne(id);
    } catch (error: any) {
      throw this.handleException(error);
    }
  }

  @ApiOperation({ summary: 'Update a city by ID' })
  @ApiAcceptedResponse()
  @Put(':id')
  async updateCity(
    @UUIDParam('id') id: Uuid,
    @Body() updateSectionsDto: UpdateSectionsDto,
  ): Promise<any> {
    try {
      await this.SectionsService.update(id, updateSectionsDto);
    } catch (error: any) {
      throw this.handleException(error);
    }
  }

  @ApiOperation({ summary: 'Delete a city by ID' })
  @ApiAcceptedResponse()
  @Delete(':id')
  async deleteCity(@UUIDParam('id') id: Uuid): Promise<any> {
    try {
      await this.SectionsService.remove(id);
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
