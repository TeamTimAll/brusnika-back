import { ApiProperty } from '@nestjs/swagger';
import { Uuid } from 'boilerplate.polyfill';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePremisesDto {


  @IsNotEmpty()
  @IsString()
  @ApiProperty({
      example : "Premise name ",
      required : true ,
      type : String 
  })

  name !: string;

 
  // storage 
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example : 22,
    description : "Total storage for the premise",
    type : Number 
  })
  totalStorage !: number 

  // vacant storage 
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example : 12,
    description : "Total  vacant storage for the premise",
    type : Number 
  })
  totalVacantStorage !: number 

  // apartment 
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
      example : 22,
      description : "Total apartments",
      type : Number 
  })
  totalApartment !: number 

  // vacant apartment 
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example : 12,
    description : "Total vacant apartment",
    type : Number 
  })
  totalVacantApartment !: number 

  // total parking space 
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example : 33,
    description : "Total parking space",
    type : Number 
  })
  totalParkingSpace !: number 

  // total vacant parking space 
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example : 44,
    description : "Total vacant parking space ",
    type : Number 
  })
  totalVacantParkingSpace !: number 


  // commercial
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example : 3,
    description : "Total commercial",
    type : Number 
  })
  totalCommercial !: number 

  // vacant commercail
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
     example : 1,
     description : "Total vacant commercial",
     type : Number 
  })
  totalVacantCommercial !: number 

  @IsNotEmpty()
  @ApiProperty({
      required : true ,
      example : "a949e0ad-97cc-4dfa-81bb-efe191eb903b"
  })

  projectId !: Uuid
  
}
