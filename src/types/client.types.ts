import { Uuid } from "boilerplate.polyfill"

export type IClientStatusCreatedType = {
    success : boolean ,
    error_reason ? : string  ,
    clientStatusId ? : string 
}


export type IStatusType  = "lead verification" |  "refusal to secure" | " weak fixation" |  "strong fixation"



export type IClientCreateStatus = {
      clientId : Uuid,
      type : IStatusType 
}
