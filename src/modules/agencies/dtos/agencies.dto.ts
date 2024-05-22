import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { DynamicTranslate, StaticTranslate } from '../../../decorators';
import { type AgenciesEntity } from '../agencies.entity';

export class AgenciesDto extends AbstractDto {
  @ApiPropertyOptional()
  @DynamicTranslate()
  title?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  @StaticTranslate()
  info: string;

  constructor(AgenciesEntity: AgenciesEntity) {
    super(AgenciesEntity);

    this.info = 'keywords.admin';
  }
}
