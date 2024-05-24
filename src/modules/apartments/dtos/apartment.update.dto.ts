import { ApiProperty } from "@nestjs/swagger";
import { Uuid } from "boilerplate.polyfill";
import { IsString, IsOptional   } from "class-validator";



export class ApartmentUpdateDto {

      @ApiProperty({
          example : "a8dde602-d4e4-4dce-83b4-353e1941bd3c",
          type : String ,
          description : "Building id to find  a  Building",
          required : true 
      })
      @IsOptional()
      @IsString()
      buildingId !: Uuid 

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
      @ApiProperty({
          example : 4 ,
          description : "Apartment floor",
          type : Number  
      })
      floor ?: number  

      @IsOptional()
      @ApiProperty({
            example : 1 ,
            description : "Similiar apartments",
            type : Number  ,
            required : false  
      })
      similiarApartmentCount !: number  
  
      @IsOptional()
      @IsString()
      @ApiProperty({
            required : false  ,
            example  :" Name of apartment",
            type : String ,
      })
      title ?: string 
  
      @IsOptional()
      @ApiProperty({
          example : 2,
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
    @ApiProperty({
      type: 'array',
      items: {
          type: 'string',
          format: 'binary', 
      },
      description: 'Images of the Building (from multiple file uploads)',
      required : false 
     })
      photos ?: Array<Express.Multer.File>  | any 


    @IsOptional()
    @ApiProperty({
        description : "Apartment number",
        example :22,
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




