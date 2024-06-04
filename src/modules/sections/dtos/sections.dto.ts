import { ApiPropertyOptional } from '@nestjs/swagger';

import { BaseDto } from '../../../common/dto/abstract.dto';

export class SectionsDto extends BaseDto {
  @ApiPropertyOptional()
  name!: string;
}
