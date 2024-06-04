import { IsString, IsNotEmpty, IsOptional, IsDateString, IsUUID, IsMobilePhone } from 'class-validator';
import { Type } from 'class-transformer';
import { Uuid } from 'boilerplate.polyfill';

class ClientCreateDto {
  @IsNotEmpty()
  @IsString()
  fullName!: string;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsNotEmpty()
  @IsMobilePhone()
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
  @Type(() => Number)
  daysUntilEndOfAssignment!: number;

  @IsOptional()
  @IsString()
  managerNote?: string;

  @IsNotEmpty()
  @IsUUID()
  userId!: Uuid;
}

export { ClientCreateDto };
