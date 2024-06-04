import { Uuid } from "boilerplate.polyfill"
import { BaseDto } from "../../../common/dto/abstract.dto"
import { IStatusType } from "types/client.types"




export class ClientStatusCreateDto extends BaseDto {
    type  !: IStatusType
    userId !: Uuid
}

