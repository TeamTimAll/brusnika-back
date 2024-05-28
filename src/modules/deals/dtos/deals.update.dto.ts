import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, IsIn } from 'class-validator';
import { DealsCreateDto } from "./deals.create.dto"

export class UpdateDealsDto extends PartialType(DealsCreateDto) {
  @IsNotEmpty()
  @IsString()
  transactionStatus !: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['negotiation', 'contract signing', 'closed', 'lost']) 
  transactionStage !: string;

  @IsNotEmpty()
  lastStageChangeDate !: Date;

  @IsNotEmpty()
  @IsString()
  newStageOnLastChange !: string;
}
