import { ApiPropertyOptional } from '@nestjs/swagger';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import { CommentEntity } from '../comment.entity';

export class CommentDto extends AbstractDto {
  @ApiPropertyOptional()
  userId: string;

  @ApiPropertyOptional()
  commentId: string;

  @ApiPropertyOptional()
  comment: string;

  constructor(commentEntity: CommentEntity) {
    super(commentEntity);
    this.userId = commentEntity.userId;
    this.commentId = String(commentEntity.commentId);
    this.comment = String(commentEntity.comment);
  }
}


