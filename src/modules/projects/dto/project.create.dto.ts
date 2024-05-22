import { IsNotEmpty , IsString  , IsUUID} from "class-validator"
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

    @ApiProperty({
        example : "Project image should be given from nultipart form data ",
        type : FormData,
        required : true 
    })
    @IsNotEmpty()
    photo !: string 
}



