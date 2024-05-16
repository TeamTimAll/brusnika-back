import
 { 
    Controller ,
//     HttpCode ,
//     HttpStatus,
    Get,
    Body, 
    Put,
//     Param,
    Post,
} from '@nestjs/common';

import { CommentsService } from './comments.service';
import { AddCommentDto } from './dtos/comment.create.dto';
import { CommentUpdateDto } from './dtos/comment.update.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('comments')
@ApiTags('comments')

export class CommentsController {

     constructor( private  commentsService : CommentsService) {};
      
     @Get()
//      @HttpCode(HttpStatus.OK)
     async  getAll(){
           return  this.commentsService.getAllComments()
     }

      @Post()
      async createComment( @Body() commentBody : AddCommentDto){
          return this.commentsService.addComment(commentBody)
     }
    
     @Put()
     async updateComment( @Body() commentUpdate : CommentUpdateDto) {
         return this.commentsService.updateComment(commentUpdate)
     };
};


