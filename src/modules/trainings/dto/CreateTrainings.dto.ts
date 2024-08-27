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
import { TrainingAccess } from "../trainings.entity";

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

	@ApiProperty({
		description: "The first category of the trainings",
		required: false,
	})
	@IsNotEmpty()
	@IsInt()
	@Type(() => Number)
	category_id!: number;

	@ApiProperty({
		description: "Is copy enabled",
		required: false,
	})
	@IsBoolean()
	@IsOptional()
	is_copy_enabled?: boolean;

	// @ApiProperty()
	@IsInt()
	@Type(() => Number)
	@IsOptional()
	user_id?: number;

	@ApiProperty({ enum: TrainingAccess })
	@IsEnum(TrainingAccess)
	@IsOptional()
	access?: TrainingAccess;

	@ApiProperty()
	@IsInt()
	@Type(() => Number)
	@IsOptional()
	access_user_id?: number;

	@ApiProperty({ required: false })
	@IsBoolean()
	@IsOptional()
	is_active?: boolean;
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
