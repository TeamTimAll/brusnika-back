import { ApiProperty } from '@nestjs/swagger';
import { Uuid } from 'boilerplate.polyfill';
import { EVENT_TYPES } from '../events.entity';
import { IsEnum, IsString } from 'class-validator';

export class CreateEventsDto {
  @IsString()
  @ApiProperty({
    required: true,
    maxLength: 1000,
    minLength: 3,
  })
  
  title!: string;

  @IsString()
  @ApiProperty({
    required: true,
    maxLength: 1000,
    minLength: 3,
  })
  
  description!: string;
  userId: Uuid | undefined;

  @IsEnum(EVENT_TYPES)
  @ApiProperty({
    type: 'enum',
    enum: EVENT_TYPES,
    required: true,
  })
  
  type!: EVENT_TYPES;
}
