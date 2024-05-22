import { IsNotEmpty , IsString  , IsUUID , IsNumber} from "class-validator"
import { ApiProperty } from "@nestjs/swagger";
import { Uuid } from "boilerplate.polyfill";


export class CreateProjectDto {
    @ApiProperty({
        example : "84895621-615d-4a18-b076-d9dc71a5b0f7",
        required : true 
    })
    @IsUUID()
    @IsNotEmpty()
    userId!: Uuid;

    @IsString()
    @IsNotEmpty()
    @ApiProperty( {
          example : "Name",
          required : true 
    })
    name!: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
          example : "Something deatiled about the project",
          required : true 
    })
    detailedDescription!: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
          example : "Brief description about the project",
          required : true 
    })
    briefDescription!: string;

    @IsNumber()
    @IsNotEmpty()
    price !: number

    @IsNotEmpty()
    @IsString()
    location !: string 
     
    @IsNotEmpty()
    @IsString()
    endDate !: Date 

    @ApiProperty({
      type: 'string',
      format: 'binary', 
      description: 'Image of the premise (from file upload)'
    })
    file !: Express.Multer.File;
}




