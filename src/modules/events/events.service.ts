import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { type PageDto } from '../../common/dto/page.dto';
import { CreateEventsDto } from './dtos/create-events.dto';
import { type EventsDto } from './dtos/events.dto';
import { type EventsPageOptionsDto } from './dtos/events-page-options.dto';
import { type UpdateEventsDto } from './dtos/update-events.dto';
import { EventsNotFoundException } from './exceptions/events-not-found.exception';
import { EventsEntity } from './events.entity';
import { Uuid } from 'boilerplate.polyfill';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventsEntity)
    private eventsRepository: Repository<EventsEntity>
  ) {}

  async  createEvents(
    userId: Uuid,
    createEventsDto: CreateEventsDto,
  ): Promise<EventsEntity> {
    createEventsDto.userId = userId
    const createdEvent : EventsEntity  = await this.eventsRepository.save(createEventsDto)
    return  createdEvent
  }

  async getAllEvents(
    EventsPageOptionsDto: EventsPageOptionsDto,
  ): Promise<PageDto<EventsDto>> {
    const queryBuilder = this.eventsRepository.createQueryBuilder(
      'Events',
    );

    const [items, pageMetaDto] =
      await queryBuilder.paginate(EventsPageOptionsDto);


    return items.toPageDto(pageMetaDto);
  }

  async getSingleEvents(id: Uuid): Promise<EventsEntity> {
    const queryBuilder = this.eventsRepository.createQueryBuilder(
      'Events',
    ).where('Events.id = :id', { id });

    const EventsEntity = await queryBuilder.getOne();

    if (!EventsEntity) {
      throw new EventsNotFoundException();
    }

    return EventsEntity;
  }

  async updateEvents(

    id: Uuid,
    updateEventsDto: UpdateEventsDto,

  ): Promise<void> {
    const queryBuilder = this.eventsRepository.createQueryBuilder(
      'Events',
    ).where('Events.id = :id', { id });

    const EventsEntity = await queryBuilder.getOne();

    if (!EventsEntity) {
      throw new EventsNotFoundException();
    }

    await this.eventsRepository.merge(EventsEntity, updateEventsDto);

    await this.eventsRepository.save(updateEventsDto);
  }

  async deleteEvents(id: Uuid): Promise<void> {
    const queryBuilder = this.eventsRepository.createQueryBuilder(
      'Events',
    ).where('Events.id = :id', { id });

    const EventsEntity = await queryBuilder.getOne();

    if (!EventsEntity) {
      throw new EventsNotFoundException();
    }

    await this.eventsRepository.remove(EventsEntity);
  };

  async updateEventLike(id: Uuid): Promise<void> {
    const queryBuilder =  await this.eventsRepository.createQueryBuilder(
      'Events',
    ).where('Events.id = :id', { id });

    const event = await queryBuilder.getOne();


    if (!event) {
      throw new EventsNotFoundException();
    };


    event.likeCount++; 
    await this.eventsRepository.save(event);
  }


    async updateEventView(id: Uuid): Promise<void> {
      const queryBuilder =  await this.eventsRepository.createQueryBuilder(
        'Events',
      ).where('Events.id = :id', { id });

      const event = await queryBuilder.getOne();

    if (!event) {
      throw new EventsNotFoundException();
    }
    
    event.views++; // Increment view count
    await this.eventsRepository.save(event);
  }
}



