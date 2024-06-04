import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Uuid } from 'boilerplate.polyfill';
import { RoleType } from '../../constants';
import { Auth, AuthUser, UUIDParam } from '../../decorators';
import { UserEntity } from '../user/user.entity';
import { CreateEventsDto } from './dtos/create-events.dto';
import { EventsDto } from './dtos/events.dto';
import { UpdateEventsDto } from './dtos/update-events.dto';
import { EventsService } from './events.service';

@Controller('/events')
@ApiTags('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: EventsDto })
  @Post()
  async createEvents(
    @Body() createEventsDto: CreateEventsDto,
    @AuthUser() user: UserEntity,
  ) {
    const EventsEntity = await this.eventsService.createEvents(
      user.id,
      createEventsDto,
    );

    return EventsEntity.toDto();
  }

  @Get(':id')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: EventsDto })
  async getSingleEvents(@UUIDParam('id') id: Uuid): Promise<EventsDto> {
    const entity = await this.eventsService.getSingleEvents(id);
    return entity.toDto();
  }

  @Put(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse()
  updateEvents(
    @UUIDParam('id') id: Uuid,
    @Body() updateEventsDto: UpdateEventsDto,
  ): Promise<void> {
    return this.eventsService.updateEvents(id, updateEventsDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse()
  async deleteEvents(@UUIDParam('id') id: Uuid): Promise<void> {
    await this.eventsService.deleteEvents(id);
  }
}
