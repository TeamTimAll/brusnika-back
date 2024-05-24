import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsEnum } from "class-validator"; 
import { CommercialStatus } from "../commercial.entity"


export class CommercialUpdateDto  {
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    example: "2272bed5-ba1d-4a5a-a9e5-a84c901fdc42", 
    description: "Building ID to update the storage (optional)",
  })
  buildingId?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    example: "100 USD",
    description: "Price for a storage (optional)",
  })
  price?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    example: "10 sq.m.",
    description: "Size for a storage (optional)",
  })
  size?: string;

  @IsOptional()
  @IsEnum(CommercialStatus, { message: "Invalid storage status" })
  @ApiProperty({
    required: false,
    enum: CommercialStatus,
    description: "Status for storage (optional)",
  })
  status?: CommercialStatus;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    example: "A105",
    description: "Storage number (optional)",
  })
  commercialNumber ?: string;

  @IsOptional()
  @ApiProperty({
    required: false,
    type: Number,
    example: 2,
    description: "Floor for a storage (optional)",
  })
  floor?: number;

  @ApiProperty({
    type: "string",
    format: "binary",
    description: "Image of the storage (from file upload, optional)",
    required: false,
  })
  file?: Express.Multer.File;
}
