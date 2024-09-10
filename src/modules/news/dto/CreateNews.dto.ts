import {
	ApiProperty,
	ApiPropertyOptional,
	getSchemaPath,
} from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsBoolean,
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidateNested,
} from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";
import { RoleType } from "../../../constants";

export class CreateNewsDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		description: "The title of the news",
		example: "The title of the news",
		required: true,
	})
	title!: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		description: "The content of the news",
		example: "111212.html",
		required: true,
	})
	content!: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		description: "The cover image of the news",
		example: "121212.png",
		required: true,
	})
	cover_image!: string;

	@IsOptional()
	@IsInt()
	@Type(() => Number)
	@ApiProperty({
		description: "The first category of the news",
		example: "The first category of the news",
		required: false,
	})
	primary_category_id!: number;

	@IsOptional()
	@IsInt()
	@Type(() => Number)
	@ApiProperty({
		description: "The second category of the news",
		example: "The second category of the news",
		required: false,
	})
	second_category_id!: number;

	@IsBoolean()
	@ApiProperty({
		description: "Is like enabled",
		required: true,
	})
	is_like_enabled!: boolean;

	@ApiPropertyOptional({ enum: RoleType })
	@IsEnum(RoleType)
	@IsOptional()
	access?: RoleType;

	@ApiProperty({
		required: false,
		description: "Is banner",
		default: false,
	})
	@IsBoolean()
	is_banner!: boolean;

	@IsBoolean()
	@IsOptional()
	@ApiProperty({
		description: "Is extra like enabled",
		required: false,
	})
	is_extra_like_enabled!: boolean;

	@IsString()
	@IsOptional()
	@ApiProperty({
		description: "The extra like icon",
		required: false,
		example: "121212.png",
	})
	extra_like_icon!: string;

	@IsInt()
	@Type(() => Number)
	@IsOptional()
	user_id?: number;
}

export class CreateNewsMetaDataDto extends BaseDto<CreateNewsDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(CreateNewsDto) }],
		type: () => CreateNewsDto,
	})
	@ValidateNested()
	@Type(() => CreateNewsDto)
	declare data: CreateNewsDto;
}
