import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsString, ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

export class NewsDto {
	@IsString()
	@IsNotEmpty()
	title!: string;

	@IsString()
	@IsNotEmpty()
	content!: string;

	@IsString()
	@IsNotEmpty()
	coverImage!: string;
}

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
