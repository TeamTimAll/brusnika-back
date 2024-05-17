
import { IsString , IsNotEmpty  } from "class-validator"
import { Uuid } from "boilerplate.polyfill"
import { AbstractDto } from "../../../common/dto/abstract.dto"

export class ProjectSDto  extends  AbstractDto{

    @IsNotEmpty()
    @IsString()
    title !: string 

    @IsNotEmpty()
    @IsString()
    description !: string 
    
    @IsNotEmpty()
    @IsString()
    userId !: Uuid
};

