import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';

export class SectionsDto extends AbstractDto {
  @ApiPropertyOptional()
  name!: string;
}
