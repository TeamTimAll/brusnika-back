import { ApiPropertyOptional } from "@nestjs/swagger";

import { CommentEntity } from "../comment.entity";

export class CommentDto {
	@ApiPropertyOptional()
	user_id: number;

	@ApiPropertyOptional()
	comment: string;

	constructor(commentEntity: CommentEntity) {
		this.user_id = commentEntity.user_id;
		this.comment = String(commentEntity.comment);
	}
}
