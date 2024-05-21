import { AbstractEntity } from "../../common/abstract.entity";
import { UseDto } from "../../decorators";
import { Entity } from "typeorm";
import { DealsDto } from "./dtos/deals.dto";





@Entity({ name :  "deals"})
@UseDto(DealsDto)
export class DealsEntity extends AbstractEntity  {}



