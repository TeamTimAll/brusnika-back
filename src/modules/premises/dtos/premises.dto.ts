import { AbstractDto } from '../../../common/dto/abstract.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { PremisesType, CommercialStatus } from '../premises.entity';
import { EnumFieldOptional } from '../../../decorators';
import { Uuid } from 'boilerplate.polyfill';

export class PremisesDto extends AbstractDto {
  @ApiProperty({ example: 'Apartment 1' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    enum: PremisesType,
    required: true,
  })
  @IsOptional()
  type!: PremisesType | undefined;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsString()
  building_id?: string;

  @ApiProperty({ example: '1000' })
  @IsOptional()
  @IsString()
  price?: string;

  @ApiProperty({ example: '50' })
  @IsOptional()
  @IsNumber()
  size?: number;

  @EnumFieldOptional(() => CommercialStatus)
  @IsOptional()
  status?: CommercialStatus;

  @ApiProperty({ example: 2 })
  @IsOptional()
  @IsNumber()
  floor?: number;

  @ApiProperty({ example: 'photo.jpg' })
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiProperty({ example: 3 })
  @IsOptional()
  @IsNumber()
  rooms?: number;

  @ApiProperty({ example: ['photo1.jpg', 'photo2.jpg'] })
  @IsOptional()
  @IsString({ each: true })
  photos?: string[];

  @ApiProperty({ example: 5 })
  @IsOptional()
  @IsNumber()
  similiarApartmentCount?: number;

  @ApiProperty({ example: 'Apartment for rent' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: '2022-01-01' })
  @IsOptional()
  @IsString()
  end_date?: string;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  number?: number;

  @ApiProperty({ example: '1000' })
  @IsOptional()
  @IsString()
  mortagePayment?: string;
}

export class PremisesFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  endYear?: Date;

  @ApiProperty({
    enum: PremisesType,
    required: false,
  })
  @IsOptional()
  type!: PremisesType | undefined;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  section_id?: Uuid;

  @ApiProperty({ example: 3, required: false })
  @IsOptional()
  @IsNumber()
  rooms?: number;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  project_id?: Uuid;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  building_id?: Uuid;

  @ApiProperty({ example: '50' })
  @IsOptional()
  @IsNumber()
  min_size?: number;

  @ApiProperty({ example: '50' })
  @IsOptional()
  @IsNumber()
  max_size?: number;

  @ApiProperty({ example: '50' })
  @IsOptional()
  @IsNumber()
  min_price?: number;

  @ApiProperty({ example: '50' })
  @IsOptional()
  @IsNumber()
  max_price?: number;

  @ApiProperty({ example: '50' })
  @IsOptional()
  @IsNumber()
  min_floor?: number;

  @ApiProperty({ example: '50' })
  @IsOptional()
  @IsNumber()
  max_floor?: number;

  @ApiProperty({ example: '50' })
  @IsOptional()
  @IsNumber()
  min_number?: number;

  @ApiProperty({ example: '50' })
  @IsOptional()
  @IsNumber()
  max_number?: number;

  @EnumFieldOptional(() => CommercialStatus)
  @IsOptional()
  status?: CommercialStatus;
}
