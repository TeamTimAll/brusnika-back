import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { CommercialStatus } from "../commercial.entity"

export class CommercialDto {

    @IsNotEmpty()
    @ApiProperty()
    buildingId !: string 

    @IsNotEmpty()
    @ApiProperty({
          required : true ,
          type : String ,
          example : "",
          description :"Price for a storage"
    })
    price  !: string 

    @IsNotEmpty()
    @ApiProperty({
          required : true ,
          type : String ,
          example : "",
          description :"Size for a storage"
    })
    size   !: string 

    @IsNotEmpty()
    @ApiProperty({
      required: true,
      enum: CommercialStatus, 
      description: "Status for storage",
    })
    status!: CommercialStatus;
    
    @IsNotEmpty()
    @ApiProperty({
          required : true ,
          type : String ,
          example : "",
          description :"Size for a storage"
    })
    commercialNumber    !: string 

    @IsNotEmpty()
    @ApiProperty({
          required : true ,
          type : Number ,
          example : Number(22),
          description :"Size for a storage"
    })
    floor   !: number 
    
    @IsNotEmpty()
    photo !: string
    
}