import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateBuilding {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Building name ',
    required: false,
    type: String,
  })
  name!: string;

  // storage
  // @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 22,
    description: 'Total storage for the building',
    type: Number,
    required: false,
  })
  totalStorage!: number;

  // vacant storage
  // @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 12,
    description: 'Total  vacant storage for the building',
    type: Number,
    required: false,
  })
  totalVacantStorage!: number;

  // apartment
  // @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 22,
    description: 'Total apartments',
    type: Number,
    required: false,
  })
  totalApartment!: number;

  // vacant apartment
  @IsOptional()
  // @IsNumber()
  @ApiProperty({
    example: 12,
    description: 'Total vacant apartment',
    type: Number,
    required: false,
  })
  totalVacantApartment!: number;

  // total parking space
  @IsOptional()
  // @IsNumber()
  @ApiProperty({
    example: 33,
    description: 'Total parking space',
    type: Number,
    required: false,
  })
  totalParkingSpace!: number;

  // total vacant parking space
  @IsOptional()
  // @IsNumber()
  @ApiProperty({
    example: 44,
    description: 'Total vacant parking space ',
    type: Number,
    required: false,
  })
  totalVacantParkingSpace!: number;

  // commercial
  // @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 3,
    description: 'Total commercial',
    type: Number,
    required: false,
  })
  totalCommercial!: number;

  // vacant commercail
  @IsOptional()
  // @IsNumber()
  @ApiProperty({
    example: 1,
    description: 'Total vacant commercial',
    type: Number,
    required: false,
  })
  totalVacantCommercial!: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Somewhere for building address',
    type: String,
    required: false,
  })
  address?: string;

  @IsOptional()
  // @IsNumber()
  @ApiProperty({
    example: 6,
    type: Number,
    description: 'Number of floors for a building',
    required: false,
  })
  numberOfFloors?: number;

  @IsOptional()
  @ApiProperty({
    type: 'array',
    description: 'Images of the building (from multiple file uploads)',
    required: false,
  })
  photos?: string[];
}
