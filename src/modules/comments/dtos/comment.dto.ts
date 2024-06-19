import { ApiPropertyOptional } from "@nestjs/swagger";
import { BaseDto } from "../../../common/dto/abstract.dto";
import { CommentEntity } from "../comment.entity";

export class CommentDto extends BaseDto {
	@ApiPropertyOptional()
	userId: string;

	@ApiPropertyOptional()
	comment: string;

	constructor(commentEntity: CommentEntity) {
		super(commentEntity);
		this.userId = commentEntity.userId;
		this.comment = String(commentEntity.comment);
	}
}
