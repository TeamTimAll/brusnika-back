import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsUUID, IsPhoneNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { AbstractDto } from 'common/dto/abstract.dto';

enum PinningType {
  LEAD_VERIFICATION = 'lead verification',
  REFUSAL_TO_SECURE = 'refusal to secure',
  WEAK_FIXATION = 'weak fixation',
  STRONG_FIXATION = 'strong fixation',
}

class ClientDto  extends AbstractDto {
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
}

export { ClientDto, PinningType };
