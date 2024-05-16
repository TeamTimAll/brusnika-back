import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { DynamicTranslate, StaticTranslate } from '../../../decorators';
import { type EventsEntity } from '../events.entity';

export class EventsDto extends AbstractDto {
  @ApiPropertyOptional()
  @DynamicTranslate()
  title?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  @StaticTranslate()
  info: string;

  constructor(EventsEntity: EventsEntity) {
    super(EventsEntity);

    this.info = 'keywords.admin';
  }
}
