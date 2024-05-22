
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsNumber, IsString } from 'class-validator';

export class UpdatePremiseDto  {
  @IsOptional()
  @ApiProperty({
      type : String ,
      example : "apartment",
      required : true 
  })
  @IsEnum(['apartment', 'parking', 'storage', 'commercial'])
  type !: 'apartment' | 'parking' | 'storage' | 'commercial';
  

  @IsOptional()
  @IsString()
  @ApiProperty({
      required : false ,
      type : String ,
      example : "Updated premise name "
  })
  name !: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
     example : 22,
     type :Number,
     required : false 
  })
  total !: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    example : 22,
    type :Number,
    required : false 
 })
  totalVacant !: number;
   
}
