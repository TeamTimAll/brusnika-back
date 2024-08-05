import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsString, ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

export class UpdateNewsDto {
	@IsString()
	@ApiProperty({
		required: false,
		description: "Title of the news",
	})
	@IsOptional()
	title?: string;

	@IsString()
	@ApiProperty({
		required: false,
		description: "Content of the news",
	})
	@IsOptional()
	content?: string;

	@IsString()
	@ApiProperty({
		required: false,
		description: "Image URL",
	})
	@IsOptional()
	cover_image?: string;
}

export class UpdateNewsMetaDataDto extends BaseDto<UpdateNewsDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(UpdateNewsDto) }],
		type: () => UpdateNewsDto,
	})
	@ValidateNested()
	@Type(() => UpdateNewsDto)
	declare data: UpdateNewsDto;
}
