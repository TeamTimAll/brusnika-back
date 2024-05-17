

import { IsString, IsNotEmpty } from "class-validator";
import { Uuid } from "boilerplate.polyfill";

export class UpdateProjectDto {

    @IsNotEmpty()
    @IsString()
    projectId !: Uuid;

    @IsNotEmpty()
    @IsString()
    title !: string;

    @IsNotEmpty()
    @IsString()
    description !: string;
}
