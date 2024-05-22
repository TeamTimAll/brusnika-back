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
      type: 'string',
      format: 'binary', 
      description: 'Image of the premise (from file upload)'
    })
    file !: Express.Multer.File;
}




/*
Tasks module 
 Manager can assign tasks 
 Tasks type archivied or views tasks 

    • Task number
    • Transaction number
    • Task start time and date 
    • Task end time and date 
    • Client's full name 
    • Client phone number
    • Type of task (initial display, repeat display, call to client, other)
    • Project
    • Current status and stage of the transaction
    • A comment optional

Task can have status ( opened or  closed)

 */