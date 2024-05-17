
import { IsString , IsNotEmpty  } from "class-validator"
import { Uuid } from "boilerplate.polyfill"

export class ProjectSDto {

    @IsNotEmpty()
    @IsString()
    title !: string 

    @IsNotEmpty()
    @IsString()
    description !: string 
    
    @IsNotEmpty()
    @IsString()
    userId !: Uuid


}