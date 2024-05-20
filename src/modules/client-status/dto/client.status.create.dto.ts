import { Uuid } from "boilerplate.polyfill"
import { AbstractDto } from "../../../common/dto/abstract.dto"
import { IStatusType } from "types/client.types"




export class ClientStatusCreateDto extends AbstractDto {
    type  !: IStatusType
    userId !: Uuid
}

