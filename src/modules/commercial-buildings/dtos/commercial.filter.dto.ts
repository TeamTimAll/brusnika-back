import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsNumber } from 'class-validator';
import { CommercialStatus } from "../commercial.entity"

export class CommercaialFilterDto  {

    @IsOptional()
    @IsString()
    @ApiProperty({
        required: false,
        type: String,
        example: "100 USD", // Example for price filtering
        description: 'Price to filter by (optional)',
    })
    price?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        required: false,
        type: String,
        example: "10 sq.m.", // Example for size filtering
        description: 'Size to filter by (optional)',
    })
    size?: string;

    @IsOptional()
    @IsEnum(CommercialStatus, { message: 'Invalid storage status' })
    @ApiProperty({
        required: false,
        enum: CommercialStatus,
        example: CommercialStatus.FREE, // Example of an enum value
        description: 'Status to filter by (optional)',
    })
    status?: CommercialStatus;

    @IsOptional()
    @IsString()
    @ApiProperty({
        required: false,
        type: String,
        example: "A105", // Example for storage number filtering
        description: 'Storage number to filter by (optional)',
    })
    storageNumber?: string;

    @IsOptional()
    @IsNumber() 
    @ApiProperty({
        required: false,
        type: Number,
        example: 2, // Example for floor filtering
        description: 'Floor to filter by (optional)',
    })
    floor?: number;
}
