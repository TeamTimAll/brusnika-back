import { IsOptional, IsString, IsUUID, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class ClientFilterDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  establishmentDateFrom?: Date;

  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  establishmentDateTo?: Date;

  @IsOptional()
  @IsString()
  transactionStatus?: string;

  @IsOptional()
  @IsString()
  transactionStage?: string;

  @IsOptional()
  active?: boolean;
}
