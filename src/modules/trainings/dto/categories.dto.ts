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
import { TrainingCategoryEntity } from "../entities/categories.entity";

export class TrainingCategoryDto
	implements Omit<TrainingCategoryEntity, "ext_id">
{
	@ApiProperty()
	id!: number;

	@ApiProperty()
	created_at!: Date;

	@ApiProperty()
	updated_at!: Date;

	@ApiProperty()
	name!: string;

	@ApiProperty()
	sequnce_id!: number;

	@ApiProperty()
	is_active!: boolean;
}

export class CreateTrainingCategoryDto {
	@ApiProperty({
		description: "Name of the category",
		example: "Politics",
	})
	@IsString()
	@IsNotEmpty()
	name!: string;

	@ApiProperty()
	@Type(() => Number)
	@IsInt()
	@IsNotEmpty()
	sequnce_id!: number;

	@ApiProperty({ required: false })
	@IsBoolean()
	@IsOptional()
	is_active?: boolean;
}

export class CreateTrainingCategoryMetaDataDto extends BaseDto<CreateTrainingCategoryDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(CreateTrainingCategoryDto) }],
		type: () => CreateTrainingCategoryDto,
	})
	@ValidateNested()
	@Type(() => CreateTrainingCategoryDto)
	declare data: CreateTrainingCategoryDto;
}

export class UpdateTrainingsCategoriesDto {}
