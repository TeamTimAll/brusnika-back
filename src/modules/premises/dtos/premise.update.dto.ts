

import { ApiProperty } from '@nestjs/swagger';
import {  IsNumber, IsOptional, IsString  } from 'class-validator';

export class UpdatePremiseDto {


  @IsOptional()
  @IsString()
  @ApiProperty({
      example : "Premise name ",
      required : true ,
      type : String 
  })

  name !: string;

 
  // storage 
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example : 22,
    description : "Total storage for the premise",
    type : Number 
  })
  totalStorage !: number 

  // vacant storage 
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example : 12,
    description : "Total  vacant storage for the premise",
    type : Number 
  })
  totalVacantStorage !: number 

  // apartment 
  @IsNumber()
  @IsOptional()
  @ApiProperty({
      example : 22,
      description : "Total apartments",
      type : Number 
  })
  totalApartment !: number 

  // vacant apartment 
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    example : 12,
    description : "Total vacant apartment",
    type : Number 
  })
  totalVacantApartment !: number 

  // total parking space 
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    example : 33,
    description : "Total parking space",
    type : Number 
  })
  totalParkingSpace !: number 

  // total vacant parking space 
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    example : 44,
    description : "Total vacant parking space ",
    type : Number 
  })
  totalVacantParkingSpace !: number 


  // commercial
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example : 3,
    description : "Total commercial",
    type : Number 
  })
  totalCommercial !: number 

  // vacant commercail
  @IsOptional()
  @IsNumber()
  @ApiProperty({
     example : 1,
     description : "Total vacant commercial",
     type : Number  
  })
  totalVacantCommercial !: number  


 @IsOptional()
  @IsString()
  @ApiProperty({
    example : "Somewhere for premise address",
    type : String,
    required : true 
  })
  address ?: string 

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    example : 6,
    type : Number,
    required : true ,
    description : "Number of floors for a building"
  })
  numberOfFloors ?: number 

  
}

