import { ApiPropertyOptional } from "@nestjs/swagger";

import { BaseDto } from "../../../common/dto/abstract.dto";
import { CommentEntity } from "../comment.entity";

export class CommentDto extends BaseDto {
	@ApiPropertyOptional()
	user_id: number;

	@ApiPropertyOptional()
	comment: string;

	constructor(commentEntity: CommentEntity) {
		super(commentEntity);
		this.user_id = commentEntity.user_id;
		this.comment = String(commentEntity.comment);
	}
}
