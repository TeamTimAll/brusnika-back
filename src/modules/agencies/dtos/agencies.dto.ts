import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsUUID,
  IsString,
  IsOptional,
  IsEmail,
  IsPhoneNumber,
} from 'class-validator';
import { AbstractDto } from '../../../common/dto/abstract.dto';

export class AgenciesDto extends AbstractDto {
  @ApiProperty({ description: 'The UUID of the user' })
  @IsUUID()
  userId!: string;

  @ApiPropertyOptional({ description: 'The title of the agency' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'The UUID of the city' })
  @IsOptional()
  @IsUUID()
  city_id?: string;

  @ApiPropertyOptional({ description: 'The legal name of the agency' })
  @IsOptional()
  @IsString()
  legalName?: string;

  @ApiPropertyOptional({
    description: 'The tax identification number of the agency',
  })
  @IsOptional()
  @IsString()
  inn?: string;

  @ApiPropertyOptional({ description: 'The phone number of the agency' })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string | null;

  @ApiPropertyOptional({ description: 'The email address of the agency' })
  @IsOptional()
  @IsEmail()
  email?: string | null;

  @ApiPropertyOptional({ description: 'The full name of the owner' })
  @IsOptional()
  @IsString()
  ownerFullName?: string;

  @ApiPropertyOptional({ description: 'The phone number of the owner' })
  @IsOptional()
  @IsPhoneNumber()
  ownerPhone?: string;

  @ApiProperty({ description: 'Document for entry', required: false })
  @IsOptional()
  @IsString()
  entry_doc?: string;

  @ApiProperty({ description: 'Document for company card', required: false })
  @IsOptional()
  @IsString()
  company_card_doc?: string;

  @ApiProperty({
    description: 'Document for tax registration',
    required: false,
  })
  @IsOptional()
  @IsString()
  tax_registration_doc?: string;

  @ApiProperty({
    description: 'Document for authority signatory',
    required: false,
  })
  @IsOptional()
  @IsString()
  authority_signatory_doc?: string;
}
