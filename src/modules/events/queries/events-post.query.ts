import { type ICommand, type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EventsEntity } from '../events.entity';
import { Uuid } from 'boilerplate.polyfill';

export class GetEventsQuery implements ICommand {
  constructor(public readonly userId: Uuid) {}
}

@QueryHandler(GetEventsQuery)
export class GetEventsHandler implements IQueryHandler<GetEventsQuery> {
  constructor(
    @InjectRepository(EventsEntity)
    private EventsRepository: Repository<EventsEntity>,
  ) {}

  async execute(query: GetEventsQuery) {
    return this.EventsRepository.findBy({
      userId: query.userId as never,
    });
  }
}
