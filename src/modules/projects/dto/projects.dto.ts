
import { IsString , IsNotEmpty  , IsUUID, IsNumber } from "class-validator"
import { Uuid } from "boilerplate.polyfill"
import { AbstractDto } from "../../../common/dto/abstract.dto"

export class ProjectSDto  extends  AbstractDto{

    @IsUUID()
    @IsNotEmpty()
    userId!: Uuid;

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    detailedDescription!: string;

    @IsString()
    @IsNotEmpty()
    briefDescription!: string;

    @IsString()
    @IsNotEmpty()
    photo!: string;

    @IsNumber()
    @IsNotEmpty()
    price !: number

    @IsNotEmpty()
    @IsString()
    location !: string 
     
    @IsNotEmpty()
    @IsString()
    endDate !: Date 
};



