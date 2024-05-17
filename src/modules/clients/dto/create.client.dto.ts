import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsUUID, IsPhoneNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { PinningType } from './client.dto';
import { AbstractDto } from '../../../common/dto/abstract.dto';

export class CreateClientDto extends AbstractDto {
  @IsNotEmpty()
  @IsString()
  fullName!: string;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber!: string;

  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsString()
  transactionStatus?: string;

  @IsOptional()
  @IsString()
  transactionStage?: string;

  @IsNotEmpty()
  @IsDateString()
  establishmentDate!: Date;

  @IsNotEmpty()
  @IsEnum(PinningType)
  pinningType!: PinningType;

  @IsNotEmpty()
  @Type(() => Number)
  daysUntilEndOfAssignment!: number;

  @IsOptional()
  @IsString()
  managerNote?: string;

  @IsNotEmpty()
  @IsUUID()
  userId!: string;
}
