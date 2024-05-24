import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsOptional , IsEnum } from "class-validator";
import { ParkingSpaceStatus } from "../carParking.entity";
import { CreateCarParkingDto } from "./car-parking.create.dto";

export class UpdateCarParkingDto extends PartialType(CreateCarParkingDto) {

  @IsOptional()
  @ApiProperty({
    required: false,
    type: Number,
    example: 5, 
    description: "Car parking floor (optional)",
  })
  floor?: number;

  @IsOptional()
  @ApiProperty({
    required: false, 
    type: String,
    example: "5", 
    description: "Car parking number (optional)",
  })
  parkingPlaceNumber?: string;

  @IsOptional()
  @ApiProperty({
    required: false,
    type: String,
    example: "M32313", 
    description: "Car parking price (optional)",
  })
  price?: string;

  @IsOptional()
  @ApiProperty({
    required: false,
    type: String,
    example: "23, 2 kv", 
    description: "Car parking size (optional)",
  })
  size?: string;

  @IsOptional()
  @IsEnum(ParkingSpaceStatus, { message: 'Invalid parking space status' })
  @ApiProperty({
    required: false,
    enum: ParkingSpaceStatus,
    description: "Car parking status (free or taken, optional)",
  })
  status?: ParkingSpaceStatus;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Image of the car parking (from file upload, optional)',
    required: false,
  })
  file?: Express.Multer.File;

  @IsOptional()
  @ApiProperty({
    type: String,
    example: "",
    description: "Building ID (optional)",
    required: false,
  })
  buildingId?: string;
}
