import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateSectionsDto {
  @IsString()
  @ApiProperty({
    required: true,
    maxLength: 1000,
    minLength: 3,
  })
  name!: string;
}
