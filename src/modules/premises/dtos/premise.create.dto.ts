import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePremisesDto {
  @IsNotEmpty()
  @IsEnum(['apartment', 'parking', 'storage', 'commercial'])
  type !: 'apartment' | 'parking' | 'storage' | 'commercial';

  @IsNotEmpty()
  @IsString()
  name !: string;

  @IsNotEmpty()
  @IsNumber()
  totalAvailable !: number;

  @IsNotEmpty()
  @IsNumber()
  totalVacant !: number;
  
}
