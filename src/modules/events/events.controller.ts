import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { type PageDto } from '../../common/dto/page.dto';
import { RoleType } from '../../constants';
import { ApiPageOkResponse, Auth, AuthUser, UUIDParam } from '../../decorators';
import { UseLanguageInterceptor } from '../../interceptors/language-interceptor.service';
import { UserEntity } from '../user/user.entity';
import { CreateEventsDto } from './dtos/create-events.dto';
import { EventsDto } from './dtos/events.dto';
import { EventsPageOptionsDto } from './dtos/events-page-options.dto';
import { UpdateEventsDto } from './dtos/update-events.dto';
import { EventsService } from './events.service';
import { Uuid } from 'boilerplate.polyfill';

@Controller('/events')
@ApiTags('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: EventsDto })
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

  @Get()
  @Auth([RoleType.USER])
  @UseLanguageInterceptor()
  @ApiPageOkResponse({ type: EventsDto })
  async getEvents(
    @Query() EventsPageOptionsDto: EventsPageOptionsDto,
  ): Promise<PageDto<EventsDto>> {
    return this.eventsService.getAllEvents(EventsPageOptionsDto);
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
