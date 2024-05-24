import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { StorageStatus } from "../storage.entity";

export class StorageDto {

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
      enum: StorageStatus, 
      description: "Status for storage",
    })
    status!: StorageStatus;
    
    @IsNotEmpty()
    @ApiProperty({
          required : true ,
          type : String ,
          example : "",
          description :"Size for a storage"
    })
    storageNumber   !: string 

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