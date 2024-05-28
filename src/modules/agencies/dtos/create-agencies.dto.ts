import { ApiProperty } from '@nestjs/swagger';
import { Uuid } from 'boilerplate.polyfill';
import { IsEnum, IsString } from 'class-validator';

export class CreateAgenciesDto {
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
}
