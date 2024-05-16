import
 { 
    Controller ,
    HttpCode ,
    HttpStatus,
    Get


} from '@nestjs/common';

import { CommentsService } from './comments.service';
@Controller('comments')

export class CommentsController {

     constructor( private  commentsService : CommentsService) {};

      
     @Get("comments")
     @HttpCode(HttpStatus.OK)

     async  getAll(){
           return  this.commentsService.getAllComments()
     }


}
