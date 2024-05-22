import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Put,
  Query,
  Post,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { type PageDto } from '../../common/dto/page.dto';
import { RoleType } from '../../constants';
import { Auth, UUIDParam } from '../../decorators';
import { CreateCitiesDto } from './dtos/create-cities.dto';
import { CitiesDto } from './dtos/cities.dto';
import { CitiesPageOptionsDto } from './dtos/cities-page-options.dto';
import { UpdateCitiesDto } from './dtos/update-cities.dto';
import { CitiesService } from './cities.service';
import { Uuid } from 'boilerplate.polyfill';
import { ApiPageOkResponse } from '../../decorators';

@Controller('/Cities')
@ApiTags('Cities')
export class CitiesController {
  constructor(private CitiesService: CitiesService) {}

  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: CitiesDto })
  @Post()
  async createCities(@Body() createCitiesDto: CreateCitiesDto) {
    const CitiesEntity = await this.CitiesService.createCities(createCitiesDto);

    return CitiesEntity.toDto();
  }

  @Get()
  @Auth([RoleType.USER])
  @ApiPageOkResponse({ type: CitiesDto })
  async getCities(
    @Query() CitiesPageOptionsDto: CitiesPageOptionsDto,
  ): Promise<PageDto<CitiesDto>> {
    return this.CitiesService.getAllCities(CitiesPageOptionsDto);
  }

  @Get(':id')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: CitiesDto })
  async getSingleCities(@UUIDParam('id') id: Uuid): Promise<CitiesDto> {
    const entity = await this.CitiesService.getSingleCities(id);
    return entity.toDto();
  }

  @Put(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse()
  updateCities(
    @UUIDParam('id') id: Uuid,
    @Body() updateCitiesDto: UpdateCitiesDto,
  ): Promise<void> {
    return this.CitiesService.updateCities(id, updateCitiesDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse()
  async deleteCities(@UUIDParam('id') id: Uuid): Promise<void> {
    await this.CitiesService.deleteCities(id);
  }
}
