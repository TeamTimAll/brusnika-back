import { Uuid } from "boilerplate.polyfill";
import { AbstractDto } from "../../../common/dto/abstract.dto";
import { IsNotEmpty, IsUUID } from "class-validator";
import { IStatusType } from "types/client.types";




export class ClientStatusDto extends AbstractDto {
      
       type !: IStatusType 
     
        @IsNotEmpty()
        @IsUUID()
        userId  !: Uuid

   
}


