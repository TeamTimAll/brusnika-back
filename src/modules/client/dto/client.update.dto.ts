import { IsString, IsOptional, IsEnum, IsDateString, IsUUID, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { PinningType } from './client.dto';

import { Uuid } from 'boilerplate.polyfill';

export class UpdateClientDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
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


  @IsNotEmpty()
  clientId !: Uuid
}
