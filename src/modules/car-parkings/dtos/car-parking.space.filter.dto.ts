import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsNumber } from 'class-validator';
import { ParkingSpaceStatus } from "../carParking.entity"

export class FilterCarParking {
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    example: "100 USD", 
    description: 'Price to filter by (optional)',
  })
  price?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    example: "10 sq.m.", 
    description: 'Size to filter by (optional)',
  })
  size?: string;

  @IsOptional()
  @IsEnum(ParkingSpaceStatus, { message: 'Invalid storage status' })
  @ApiProperty({
    required: false,
    enum: ParkingSpaceStatus, 
    example: ParkingSpaceStatus.FREE, 
    description: 'Status to filter by (optional)',
  })
  status?: ParkingSpaceStatus;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    example: "A105", 
    description: 'Storage number to filter by (optional)',
  })
  storageNumber?: string;

  @IsOptional()
  @IsNumber() 
  @ApiProperty({
    required: false,
    type: Number,
    example: 2, 
    description: 'Floor to filter by (optional)',
  })
  floor?: number;
}
