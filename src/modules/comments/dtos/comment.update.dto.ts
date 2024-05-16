import { Uuid } from "boilerplate.polyfill";




export class CommentUpdateDto {
        id  !: Uuid
        comment : string 
 
      constructor(){
          this.comment = ""
      }
}