import { ApiProperty } from "@nestjs/swagger";

import { BaseDto, Dto } from "../base/base_dto";

export class LikedResponseDto {
	@ApiProperty()
	is_liked!: boolean;
}

export class LikedResponseMetaDataDto
	extends BaseDto<LikedResponseDto>
	implements Dto
{
	@ApiProperty({ type: LikedResponseDto })
	declare data: LikedResponseDto;

	desc = "";
}
