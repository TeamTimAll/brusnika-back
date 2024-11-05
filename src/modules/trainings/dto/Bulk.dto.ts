import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	ArrayMinSize,
	IsInt,
	IsNotEmpty,
	IsString,
	ValidateNested,
} from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";
import { IsPrefixes } from "../../../decorators/is-prefix.decorator";

import { CreateTrainingDto } from "./CreateTrainings.dto";
import { CreateTrainingCategoryDto } from "./categories.dto";

export class BulkCreateTrainingDto extends OmitType(CreateTrainingDto, [
	"category_id",
]) {
	@ApiProperty({ description: 'use "new-" or "old-" prefixes' })
	@IsString()
	@IsPrefixes(["new-", "old-"])
	@IsNotEmpty()
	category_ref_id!: string;
}

export class BulkCreateCategoryDto extends CreateTrainingCategoryDto {
	@ApiProperty({ description: 'use "new-" or "old-" prefixes' })
	@IsString()
	@IsPrefixes(["new-", "old-"])
	@IsNotEmpty()
	ref_id!: string;
}

export class BulkUpdateTrainingDto extends CreateTrainingDto {
	@ApiProperty()
	@IsInt()
	@Type(() => Number)
	@IsNotEmpty()
	id!: number;
}

export class BulkUpdateCategoryDto extends CreateTrainingCategoryDto {
	@ApiProperty()
	@IsInt()
	@Type(() => Number)
	@IsNotEmpty()
	id!: number;
}

class BulkCreateDto {
	@ApiProperty({ type: BulkCreateTrainingDto, isArray: true })
	@ValidateNested()
	@Type(() => BulkCreateTrainingDto)
	@ArrayMinSize(0)
	trainings!: BulkCreateTrainingDto[];

	@ApiProperty({ type: BulkCreateCategoryDto, isArray: true })
	@ValidateNested()
	@Type(() => BulkCreateCategoryDto)
	@ArrayMinSize(0)
	categories!: BulkCreateCategoryDto[];
}

class BulkUpdateDto {
	@ApiProperty({ type: BulkUpdateTrainingDto, isArray: true })
	@ValidateNested()
	@Type(() => BulkUpdateTrainingDto)
	@ArrayMinSize(0)
	trainings!: BulkUpdateTrainingDto[];

	@ApiProperty({ type: BulkUpdateCategoryDto, isArray: true })
	@ValidateNested()
	@Type(() => BulkUpdateCategoryDto)
	@ArrayMinSize(0)
	categories!: BulkUpdateCategoryDto[];
}

class BulkDeleteDto {
	@ApiProperty({ default: [] })
	@IsInt({ each: true })
	@Type(() => Number)
	@ArrayMinSize(0)
	trainings!: number[];

	@ApiProperty({ default: [] })
	@IsInt({ each: true })
	@Type(() => Number)
	@ArrayMinSize(0)
	categories!: number[];
}

export class BulkDto {
	@ApiProperty({ type: BulkCreateDto })
	@ValidateNested()
	@Type(() => BulkCreateDto)
	create!: BulkCreateDto;

	@ApiProperty({ type: BulkUpdateDto })
	@ValidateNested()
	@Type(() => BulkUpdateDto)
	update!: BulkUpdateDto;

	@ApiProperty({ type: BulkDeleteDto })
	@ValidateNested()
	@Type(() => BulkDeleteDto)
	delete!: BulkDeleteDto;
}

export class BulkMetaDataDto extends BaseDto<BulkDto> {
	@ApiProperty({ type: BulkDto })
	@ValidateNested()
	@Type(() => BulkDto)
	declare data: BulkDto;
}
