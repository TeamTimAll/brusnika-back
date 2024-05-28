import { DealsEntity } from "modules/deals/deals.entity"



export type DealsFilterResponse =  {
    lost : DealsEntity[],
    won : DealsEntity[]
}

