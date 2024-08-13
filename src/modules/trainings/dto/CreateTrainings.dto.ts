import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsBoolean,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidateNested,
} from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

export class CreateTrainingsDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		description: "The title of the trainings",
		example: "The title of the trainings",
		required: true,
	})
	title!: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		description: "The content of the trainings",
		example: "111212.html",
		required: true,
	})
	content!: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		description: "The cover image of the trainings",
		example: "121212.png",
		required: true,
	})
	cover_image!: string;

	@ApiProperty({
		description: "The first category of the trainings",
		example: "The first category of the trainings",
		required: false,
	})
	@IsOptional()
	@IsInt()
	@Type(() => Number)
	primary_category_id!: number;

	@ApiProperty({
		description: "The second category of the trainings",
		example: "The second category of the trainings",
		required: false,
	})
	@IsOptional()
	@IsInt()
	@Type(() => Number)
	second_category_id!: number;

	@IsBoolean()
	@ApiProperty({
		description: "Is like enabled",
		required: true,
	})
	is_like_enabled!: boolean;

	@ApiProperty({
		description: "Is copy enabled",
		required: true,
	})
	@IsBoolean()
	is_copy_enabled!: boolean;

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

	@ApiProperty()
	@IsInt()
	@Type(() => Number)
	@IsOptional()
	user_id?: number;
}

export class CreateTrainingsMetaDataDto extends BaseDto<CreateTrainingsDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(CreateTrainingsDto) }],
		type: () => CreateTrainingsDto,
	})
	@ValidateNested()
	@Type(() => CreateTrainingsDto)
	declare data: CreateTrainingsDto;
}
