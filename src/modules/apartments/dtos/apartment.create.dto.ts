
import { ApiProperty } from "@nestjs/swagger"
import {  IsNotEmpty , IsString   } from "class-validator"



export class ApartmentCreateDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example : "a8dde602-d4e4-4dce-83b4-353e1941bd3c",
        description : "Premise id to connect",
        type : String,
        required : true  
    })
    premiseId !: string 
    
   
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
         example : "22",
         description : "An apartment size",
         type : String,
         required : true 
    })
    size !: string 

   
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
         example :"33",
         description : "Apartment price",
         type : String,
         required : true 
    })
    price !: string 

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        example : "4" ,
        description : "Apartment floor",
        type : Number,
        required : true  
    })
    floor !: number  

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        example : "2",
        description : "Rooms for an apartment",
        type : Number,
        required : true  
    })
    rooms !: number 

    @IsNotEmpty()
    @ApiProperty({
          example : 1 ,
          description : "Such apartments",
          type : String ,
          required : true 
    })

    similiarApartmentCount  !: number 

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
          description  :" End date for apartment",
          type : String ,
          example : "3333"
    })
    endDate !: string 


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
};
