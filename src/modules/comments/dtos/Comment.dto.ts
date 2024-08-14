import { ApiProperty } from "@nestjs/swagger";

import { BaseDto, Dto } from "../../../common/base/base_dto";
import { CommentEntity } from "../comment.entity";

export class CommentDto implements CommentEntity {
	@ApiProperty()
	id!: number;

	@ApiProperty()
	created_at!: Date;

	@ApiProperty()
	updated_at!: Date;

	@ApiProperty()
	text!: string;
}

export class CommentMetaDataDto extends BaseDto<CommentDto> implements Dto {
	@ApiProperty({ type: CommentDto })
	declare data: CommentDto;

	desc = "";
}

export class CommentArrayMetaDataDto
	extends BaseDto<CommentDto[]>
	implements Dto
{
	@ApiProperty({ type: CommentDto, isArray: true })
	declare data: CommentDto[];

	desc = "";
}
