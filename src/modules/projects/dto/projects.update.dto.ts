

import { IsString , IsUUID , IsOptional, IsNotEmpty } from "class-validator";
import { Uuid } from "boilerplate.polyfill";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateProjectDto {
    @IsUUID()
    @IsOptional()
    @ApiProperty({
           example : "84895621-615d-4a18-b076-d9dc71a5b0f7",
           required : false 
    })
    userId?: Uuid;

    @IsString()
    @IsOptional()
    @ApiProperty({
        example : "Updated name ",
        required : false 
    })
    name?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
          required : false ,
          example : "Updated detailed description"
    })
    detailedDescription?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        required : false ,
        example : "Updated brief description"
    })
    briefDescription?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        type: File ,
        required: true,
        description: 'Project photo file',
    })
    photo?: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
          required : true ,
          example : "a949e0ad-97cc-4dfa-81bb-efe191eb903b",
    })
    projectId !:Uuid

}
