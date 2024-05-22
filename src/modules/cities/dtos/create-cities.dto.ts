import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCitiesDto {
  @IsString()
  @ApiProperty({
    required: true,
    maxLength: 1000,
    minLength: 3,
  })
  name!: string;
}
