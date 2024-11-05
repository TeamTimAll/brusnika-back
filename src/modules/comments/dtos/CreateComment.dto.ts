import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

export class CreateCommentDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	text!: string;
}

export class CreateCommentMetaDataDto extends BaseDto<CreateCommentDto> {
	@ApiProperty({ type: CreateCommentDto })
	declare data: CreateCommentDto;
}
