import { IsNotEmpty, IsString } from "class-validator";




export class UpdateTrainingDto  {


    @IsNotEmpty()
    @IsString()
    id !: string 


    @IsNotEmpty()
    @IsString()
    title !: string


    @IsNotEmpty()
    @IsString()
    description !: string

}