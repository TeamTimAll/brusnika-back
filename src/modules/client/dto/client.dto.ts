import { IsString, IsNotEmpty, IsOptional, IsDateString, IsUUID, IsMobilePhone } from 'class-validator';
import { Type } from 'class-transformer';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import { Uuid } from 'boilerplate.polyfill';



class ClientDto extends AbstractDto {
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

export { ClientDto };
