import { Uuid } from "boilerplate.polyfill";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";



export class TrainingCreateDto {
     
    @IsNotEmpty()
    @IsString()
    title !: string 

    @IsNotEmpty()
    @IsString()
    description !: string 

    @IsNotEmpty()
    @IsUUID()
    userId !: Uuid

}