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
import { Auth, AuthUser, UUIDParam } from '../../decorators';
import { UserEntity } from '../user/user.entity';
import { CreateAgenciesDto } from './dtos/create-agencies.dto';
import { AgenciesDto } from './dtos/agencies.dto';
import { AgenciesPageOptionsDto } from './dtos/agencies-page-options.dto';
import { UpdateAgenciesDto } from './dtos/update-agencies.dto';
import { AgenciesService } from './agencies.service';
import { Uuid } from 'boilerplate.polyfill';
import { ApiPageOkResponse } from '../../decorators';

@Controller('/Agencies')
@ApiTags('Agencies')

export class AgenciesController {
  constructor(private AgenciesService: AgenciesService) {}

  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: AgenciesDto })
  @Post()
  async createAgencies(
    @Body() createAgenciesDto: CreateAgenciesDto,
    @AuthUser() user: UserEntity,
  ) {
    const AgenciesEntity = await this.AgenciesService.createAgencies(
      user.id,
      createAgenciesDto,
    );

    return AgenciesEntity.toDto();
  }

  @Get()
  @Auth([RoleType.USER])
  @ApiPageOkResponse({ type: AgenciesDto })
  async getAgencies(
    @Query() AgenciesPageOptionsDto: AgenciesPageOptionsDto,
  ): Promise<PageDto<AgenciesDto>> {
    return this.AgenciesService.getAllAgencies(AgenciesPageOptionsDto);
  }

  @Get(':id')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AgenciesDto })
  async getSingleAgencies(@UUIDParam('id') id: Uuid): Promise<AgenciesDto> {
    const entity = await this.AgenciesService.getSingleAgencies(id);
    return entity.toDto();
  }

  @Put(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse()
  updateAgencies(
    @UUIDParam('id') id: Uuid,
    @Body() updateAgenciesDto: UpdateAgenciesDto,
  ): Promise<void> {
    return this.AgenciesService.updateAgencies(id, updateAgenciesDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse()
  async deleteAgencies(@UUIDParam('id') id: Uuid): Promise<void> {
    await this.AgenciesService.deleteAgencies(id);
  }
}
