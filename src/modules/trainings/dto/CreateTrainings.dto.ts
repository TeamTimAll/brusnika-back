import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
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

export class CreateTrainingDto {
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
		required: false,
	})
	@IsNotEmpty()
	@IsInt()
	@Type(() => Number)
	category_id!: number;

	@ApiProperty({
		description: "Is like enabled",
		required: false,
	})
	@IsBoolean()
	@IsOptional()
	is_like_enabled?: boolean;

	@ApiProperty({
		description: "Is copy enabled",
		required: false,
	})
	@IsBoolean()
	@IsOptional()
	is_copy_enabled?: boolean;

	@ApiProperty({
		description: "Is extra like enabled",
		required: false,
	})
	@IsBoolean()
	@IsOptional()
	is_extra_like_enabled?: boolean;

	@ApiProperty({
		description: "The extra like icon",
		required: false,
		example: "121212.png",
	})
	@IsString()
	@IsOptional()
	extra_like_icon?: string;

	// @ApiProperty()
	@IsInt()
	@Type(() => Number)
	@IsOptional()
	user_id?: number;

	@ApiProperty({ enum: RoleType })
	@IsEnum(RoleType)
	@IsOptional()
	access_role?: RoleType;

	@ApiProperty()
	@IsInt()
	@Type(() => Number)
	@IsOptional()
	access_user_id?: number;
}

export class CreateTrainingsMetaDataDto extends BaseDto<CreateTrainingDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(CreateTrainingDto) }],
		type: () => CreateTrainingDto,
	})
	@ValidateNested()
	@Type(() => CreateTrainingDto)
	declare data: CreateTrainingDto;
}
