
import { ApiProperty } from "@nestjs/swagger"
import { IsString , IsNotEmpty  , IsArray   } from "class-validator"
import { PremisesEntity } from "../../../modules/premises/premise.entity"


export class ApartmentDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example : "a8dde602-d4e4-4dce-83b4-353e1941bd3c",
        description : "Premise id to connect",
        type : String 
    })
    premiseId !: string 


    premise !: PremisesEntity
    
    @IsString()
    @ApiProperty({
         example : "22",
         description : "An apartment size",
         type : String
    })
    size !: string 

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
         example :"33",
         description : "Apartment price",
         type : String
    })
    price !: string 

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        example : "4" ,
        description : "Apartment floor",
        type : Number  
    })
    floor !: number  

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        example : "2",
        description : "Rooms for an apartment",
        type : Number  
    })
    rooms !: number 
    
    @IsNotEmpty()
    @ApiProperty({
          example : 1 ,
          description : "Such apartments",
          type : Number  ,
          required : true 
    })
    similiarApartmentCount !: number  

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
          required : true ,
          example  :" Name of apartment",
          type : String ,
    })
    title !: string 

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
          required : true ,
          example  :" End date for apartment",
          type : String ,
    })
    endDate !: string 

    @IsString()
    @ApiProperty({
        description : "Apartment number",
        example : "22",
        required : true ,
        type : Number 
    })
    apartmentNumber !: number  

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description : "mortage payment",
        example : "22",
        required : true ,
        type : String
    })
    mortagePayment !: string 

    @IsArray()
    @ApiProperty({
          type : "array",
          required : true 
    })

    photos !: string[]

    
}

