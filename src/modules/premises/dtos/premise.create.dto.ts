import { ApiProperty } from '@nestjs/swagger';
import { Uuid } from 'boilerplate.polyfill';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePremisesDto {
  @ApiProperty({
     examples : ['apartment', 'parking', 'storage', 'commercial'],
     required : true ,
     description : "should be one of the example as showed above",
     type : String
  })

  @IsNotEmpty()
  @IsEnum(['apartment', 'parking', 'storage', 'commercial'])
  type !: 'apartment' | 'parking' | 'storage' | 'commercial';

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
      example : "Premise name ",
      required : true ,
      type : String 
  })
  name !: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
      example : 22,
      description : "Total  ",
      type : Number,
      required : true 
  })
  total !: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
     example : 33,
     required : true ,
     type : Number ,
     description : "Available"
  })
  
  totalVacant !: number;

  @IsNotEmpty()
  @ApiProperty({
      required : true ,
      example : "a949e0ad-97cc-4dfa-81bb-efe191eb903b"
  })
  projectId !: Uuid
  
}
