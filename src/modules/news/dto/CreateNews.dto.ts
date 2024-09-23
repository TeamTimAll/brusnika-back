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
	Min,
	ValidateNested,
} from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";
import { RoleType } from "../../../constants";
import { IsDifferent } from "../../../decorators";

import { NewsDto } from "./news.dto";

export class CreateNewsDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		description: "The title of the news",
		example: "The title of the news",
	})
	title!: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		description: "The content of the news",
		example: "111212.html",
	})
	content!: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		description: "The cover image of the news",
		example: "121212.png",
	})
	cover_image!: string;

	@IsOptional()
	@IsInt()
	@Type(() => Number)
	@Min(1)
	@ApiPropertyOptional({
		description: "The first category of the news",
		example: 2,
	})
	primary_category_id!: number;

	@IsOptional()
	@IsInt()
	@Min(1)
	@Type(() => Number)
	@IsDifferent<NewsDto>("primary_category_id")
	@ApiPropertyOptional({
		description: "The second category of the news",
		example: 1,
	})
	second_category_id!: number;

	@IsBoolean()
	@ApiProperty({
		description: "Is like enabled",
	})
	is_like_enabled!: boolean;

	@ApiPropertyOptional({ enum: RoleType })
	@IsEnum(RoleType)
	@IsOptional()
	access?: RoleType;

	@ApiPropertyOptional({
		required: false,
		description: "Is banner",
	})
	@IsBoolean()
	is_banner!: boolean;

	@ApiPropertyOptional({
		required: false,
		description: "Is Draft",
	})
	@IsBoolean()
	is_draft!: boolean;

	@ApiProperty({ type: Number })
	@IsInt()
	@Type(() => Number)
	@IsOptional()
	city_id!: number;

	@IsBoolean()
	@IsOptional()
	@ApiPropertyOptional({
		description: "Is extra like enabled",
	})
	is_extra_like_enabled!: boolean;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		description: "The extra like icon",
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
