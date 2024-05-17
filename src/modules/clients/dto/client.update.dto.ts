import { IsString, IsOptional, IsEnum, IsDateString, IsUUID, IsPhoneNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { PinningType } from './client.dto';
import { AbstractDto } from 'common/dto/abstract.dto';

export class UpdateClientDto  extends AbstractDto{
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsString()
  transactionStatus?: string;

  @IsOptional()
  @IsString()
  transactionStage?: string;

  @IsOptional()
  @IsDateString()
  establishmentDate?: Date;

  @IsOptional()
  @IsEnum(PinningType)
  pinningType?: PinningType;

  @IsOptional()
  @Type(() => Number)
  daysUntilEndOfAssignment?: number;

  @IsOptional()
  @IsString()
  managerNote?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;
}
