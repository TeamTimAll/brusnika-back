import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

export class LikeNewsDto {
	@ApiProperty({
		required: true,
		description: "News id",
	})
	@IsInt()
	@Type(() => Number)
	@IsNotEmpty()
	id!: number;
}

export class LikeNewsMetaDataDto extends BaseDto<LikeNewsDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(LikeNewsDto) }],
		type: () => LikeNewsDto,
	})
	@ValidateNested()
	@Type(() => LikeNewsDto)
	declare data: LikeNewsDto;
}
