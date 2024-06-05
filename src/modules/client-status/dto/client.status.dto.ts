import { Uuid } from "boilerplate.polyfill";
import { BaseDto } from "../../../common/dto/abstract.dto";
import { IsNotEmpty, IsUUID } from "class-validator";
import { IStatusType } from "types/client.types";




export class ClientStatusDto extends BaseDto {

       type !: IStatusType

        @IsNotEmpty()
        @IsUUID()
        userId  !: Uuid


}


