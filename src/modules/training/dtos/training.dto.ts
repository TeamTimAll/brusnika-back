import { IsNotEmpty, IsString } from "class-validator";
import { BaseDto } from "../../../common/dto/abstract.dto";




export class TraningDto extends BaseDto {

    @IsNotEmpty()
    @IsString()
    title !: string

    @IsNotEmpty()
    @IsString()
    description !: string

    @IsNotEmpty()
    @IsString()
    userId !:String

    @IsNotEmpty()
    @IsString()
    imageUrl !:String
}


