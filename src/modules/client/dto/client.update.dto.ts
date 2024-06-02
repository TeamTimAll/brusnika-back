import { IsString, IsOptional, IsDateString, IsUUID, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

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
  pinningTypeId !: Uuid;

  @IsOptional()
  @Type(() => Number)
  daysUntilEndOfAssignment?: number;

  @IsOptional()
  @IsString()
  managerNote?: string;


  @IsNotEmpty()
  clientId !: Uuid
}
