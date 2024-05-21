
import { IsEnum, IsOptional, IsNumber, IsString } from 'class-validator';

export class UpdatePremiseDto  {
  @IsOptional()
  @IsEnum(['apartment', 'parking', 'storage', 'commercial'])
  type !: 'apartment' | 'parking' | 'storage' | 'commercial';

  @IsOptional()
  @IsString()
  name !: string;

  @IsOptional()
  @IsNumber()
  totalAvailable !: number;

  @IsOptional()
  @IsNumber()
  totalVacant !: number;
   
}
