import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { PinningType } from './client.dto';

export class CreateClientDto  {
  @IsNotEmpty()
  @IsString()
  fullName!: string;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsNotEmpty()
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
};

