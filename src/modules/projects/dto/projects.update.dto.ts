

import { IsString , IsUUID , IsOptional, IsNotEmpty } from "class-validator";
import { Uuid } from "boilerplate.polyfill";


export class UpdateProjectDto {
    @IsUUID()
    @IsOptional()
    userId?: Uuid;

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    detailedDescription?: string;

    @IsString()
    @IsOptional()
    briefDescription?: string;

    @IsString()
    @IsOptional()
    photo?: string;

    @IsNotEmpty()
    @IsString()
    projectId !:Uuid

}
