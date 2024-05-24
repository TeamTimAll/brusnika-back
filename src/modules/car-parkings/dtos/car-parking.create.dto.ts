import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty  , IsEnum } from "class-validator"
import { ParkingSpaceStatus  } from "../carParking.entity"

export class CreateCarParkingDto {

    @IsNotEmpty()
    @ApiProperty({
          required : true ,
          type : Number ,
          example : 4 ,
          description : "Car parking floor"
    })
    floor !: number  
    
    @IsNotEmpty()
    @ApiProperty({
          required : true ,
          type : String ,
          example : "4" ,
          description : "Car parking number "
    })
    parkingPlaceNumber !: string 
    
    @IsNotEmpty()
    @ApiProperty({
          required : true ,
          type : String ,
          example : "M32312" ,
          description : "Car parking number "
    })
    price   !: string 
    
    @IsNotEmpty()
    @ApiProperty({
          required : true ,
          type : String ,
          example : "22, 2 kv" ,
          description : "Car parking number "
    })
    size !: string 

    @IsNotEmpty()
    @IsEnum(ParkingSpaceStatus, { message: 'Invalid parking space status' }) 
    @ApiProperty({
      required: true,
      enum: ParkingSpaceStatus, 
      description: "Car parking status (free or taken)",
    })
    status!: ParkingSpaceStatus;

    @ApiProperty({
        type: 'string',
        format: 'binary', 
        description: 'Image of the car parking (from file upload)',
        required : true 
      })
      file !: Express.Multer.File;


    @IsNotEmpty()
    @ApiProperty({
         type : String ,
         example : "",
         description : "building id",
         required : true 
    })
    buildingId !: string 
};


