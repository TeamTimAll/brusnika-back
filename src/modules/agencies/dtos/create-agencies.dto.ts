import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsOptional,
} from 'class-validator';

export class CreateAgenciesDto {
  @ApiProperty({ description: 'The title of the agency' })
  @IsString()
  title!: string;

  @ApiProperty({ description: 'The UUID of the city' })
  @IsUUID()
  city_id!: string;

  @ApiProperty({ description: 'The legal name of the agency' })
  @IsString()
  legalName?: string | null;

  @ApiProperty({
    description: 'The tax identification number of the agency',
  })
  @IsString()
  inn?: string | null;

  @ApiProperty({ description: 'The phone number of the agency' })
  @IsPhoneNumber()
  phone?: string | null;

  @ApiProperty({ description: 'The email address of the agency' })
  @IsEmail()
  email?: string | null;

  @ApiProperty({ description: 'The full name of the owner' ,required:false })
  @IsOptional()
  @IsString()
  ownerFullName?: string;

  @ApiProperty({ description: 'The phone number of the owner',required:false })
  @IsOptional()
  @IsPhoneNumber()
  ownerPhone?: string;
}

export class CreateExistentAgenciesDto {
  @ApiProperty({ description: 'The title of the agency' })
  @IsString()
  title!: string;

  @ApiProperty({ description: 'The UUID of the city' })
  @IsUUID()
  city_id!: string;

  @ApiProperty({ description: 'The full name of the owner' })
  @IsString()
  ownerFullName!: string;

  @ApiProperty({ description: 'The phone number of the owner' })
  @IsPhoneNumber()
  ownerPhone!: string;
}
