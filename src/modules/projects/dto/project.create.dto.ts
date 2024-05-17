import { IsNotEmpty , IsString } from "class-validator"
import { Uuid } from "boilerplate.polyfill"

export class CreateProjectDto {

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



