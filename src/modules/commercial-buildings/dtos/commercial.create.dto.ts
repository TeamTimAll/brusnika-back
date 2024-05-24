
import { ApiProperty } from "@nestjs/swagger";
import { Uuid } from "boilerplate.polyfill";
import { IsString , IsNotEmpty  , IsEnum} from "class-validator";
import { CommercialStatus } from "../commercial.entity"


export class CommercialCreateDto {

    @IsNotEmpty()
    @ApiProperty({
          required : true ,
          type : String ,
          example : "",
          description :"Building id to  create a new storage"
    })
    buildingId !: Uuid


    @IsNotEmpty()
    @IsString()
    @ApiProperty({
          required : true ,
          type : String ,
          example : "",
          description :"Price for a storage"
    })
    price  !: string 

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
          required : true ,
          type : String ,
          example : "",
          description :"Size for a storage"
    })
    size   !: string 

    @IsNotEmpty()
    @IsEnum(CommercialStatus, { message: 'Invalid parking space status' }) 
    @ApiProperty({
      required: true,
      enum: CommercialStatus, 
      description: "Status for storage",
    })
    status!: CommercialStatus;
    
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
          required : true ,
          type : String ,
          example : "",
          description :"Size for a storage"
    })
    commercailNumber    !: string 


    @IsNotEmpty()
    @ApiProperty({
          required : true ,
          type : Number ,
          example : Number(22),
          description :"Size for a storage"
    })
    floor   !: number 

    @ApiProperty({
        type: 'string',
        format: 'binary', 
        description: 'Image of the car parking (from file upload)',
        required : true 
      })
    
    file !: Express.Multer.File;
}