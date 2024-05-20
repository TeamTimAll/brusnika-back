import { IsNotEmpty, IsString } from "class-validator";
import { AbstractDto } from "../../../common/dto/abstract.dto";




export class TraningDto extends AbstractDto {

    @IsNotEmpty()
    @IsString()
    title !: string 
    @IsNotEmpty()
    @IsString()
    description !: string 
    @IsNotEmpty()
    @IsString()
    userId !:String 
}
