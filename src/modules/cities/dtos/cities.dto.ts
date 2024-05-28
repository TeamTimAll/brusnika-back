import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';

export class CitiesDto extends AbstractDto {
  @ApiPropertyOptional()
  name!: string;
}
