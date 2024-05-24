import { ApiProperty } from '@nestjs/swagger';
import { Uuid } from 'boilerplate.polyfill';
import {  IsNotEmpty , IsString } from 'class-validator';

export class CreateBuilding {

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
      example : "Premise name ",
      required : true ,
      type : String 
  })

  name !: string;

 
  // storage 

  @IsNotEmpty()
  @ApiProperty({
    example : 22,
    description : "Total storage for the premise",
    type : Number 
  })
  totalStorage !: number 

  // vacant storage 

  @IsNotEmpty()
  @ApiProperty({
    example : 12,
    description : "Total  vacant storage for the premise",
    type : Number 
  })
  totalVacantStorage !: number 

  // apartment 

  @IsNotEmpty()
  @ApiProperty({
      example : 22,
      description : "Total apartments",
      type : Number 
  })
  totalApartment !: number 

  // vacant apartment 
  @IsNotEmpty()
  @ApiProperty({
    example : 12,
    description : "Total vacant apartment",
    type : Number 
  })
  totalVacantApartment !: number 

  // total parking space 
  @IsNotEmpty()
  @ApiProperty({
    example : 33,
    description : "Total parking space",
    type : Number 
  })
  totalParkingSpace !: number 

  // total vacant parking space 
  @IsNotEmpty()

  @ApiProperty({
    example : 44,
    description : "Total vacant parking space ",
    type : Number 
  })
  totalVacantParkingSpace !: number 


  // commercial
  @IsNotEmpty()
  @ApiProperty({
    example : 3,
    description : "Total commercial",
    type : Number 
  })
  totalCommercial !: number 

  // vacant commercail
  @IsNotEmpty()
  @ApiProperty({
     example : 1,
     description : "Total vacant commercial",
     type : Number  ,
     required : true 
  })
  totalVacantCommercial !: number  

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example : "Somewhere for premise address",
    type : String,
    required : true 
  })
  address !: string 

  @IsNotEmpty()
  @ApiProperty({
    example : 3,
    type : Number,
    required : true ,
    description : "Number of floors for a building"
  })
  numberOfFloors !: number 

  @ApiProperty({
        type: 'array',
        items: {
            type: 'string',
            format: 'binary', 
        },
        description: 'Images of the premise (from multiple file uploads)',
        required : true 
    })
    photos !: Array<Express.Multer.File>

  @IsNotEmpty()
  @ApiProperty({
      required : true ,
      example : "a949e0ad-97cc-4dfa-81bb-efe191eb903b"
  })

  projectId !: Uuid
  
}

