import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional , IsArray, IsNumber  } from "class-validator";



export class ApartmentUpdateDto {

      @ApiProperty({
          example : "a8dde602-d4e4-4dce-83b4-353e1941bd3c",
          type : String ,
          description : "Premise id to find  a  premise",
          required : true 
      })
      @IsOptional()
      @IsString()
      premiseId !: string 


      @IsOptional()
      @IsString()
      @ApiProperty({
        example : "22",
        type : String ,
        description : "Size of an apartment",
        required : false 
      })
      size ? :  string 

      @IsString()
      @IsOptional()
      @ApiProperty({
           example :"33",
           description : "Apartment price",
           type : String
      })
      price ?: string 
  
      @IsOptional()
      @IsNumber()
      @ApiProperty({
          example : "4" ,
          description : "Apartment floor",
          type : Number  
      })
      floor ?: number  

      @IsOptional()
      @ApiProperty({
            example : 1 ,
            description : "Such apartments",
            type : Number  ,
            required : true 
      })
      similiarApartmentCount !: number  
  
      @IsOptional()
      @IsString()
      @ApiProperty({
            required : true ,
            example  :" Name of apartment",
            type : String ,
      })
      title ?: string 
  
      @IsOptional()
      @IsNumber()
      @ApiProperty({
          example : "2",
          description : "Rooms for an apartment",
          type : Number  
      })

      rooms ?: number  


     @IsOptional()
     @IsString()
     @ApiProperty({
        example : "2",
        description : "End date for an apartment",
        type : String 
    })

    endDate ?: string 


    @IsOptional()
    @IsArray()
    @ApiProperty({
        type: String,
        description: 'Images of the premise (from multiple file uploads)',
    })
  
    photos ? : string[]


    @IsOptional()
    @IsNumber()
    @ApiProperty({
        description : "Apartment number",
        example : "22",
        type : Number 
    })
    apartmentNumber ?: number  

    @IsOptional()
    @IsString()
    @ApiProperty({
        description : "mortage payment",
        example : "22",
        type : String
    })
    mortagePayment ? : string 
};




