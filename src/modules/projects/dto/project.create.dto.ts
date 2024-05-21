import { IsNotEmpty , IsString  , IsUUID} from "class-validator"
import { Uuid } from "boilerplate.polyfill"

export class CreateProjectDto {
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
}



