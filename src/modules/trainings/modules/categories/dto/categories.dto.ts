import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";

import { BaseDto } from "../../../../../common/base/base_dto";

export class CreateTrainingsCategoriesDto {
	@ApiProperty({
		description: "Name of the category",
		example: "Politics",
	})
	@IsNotEmpty()
	name!: string;
}

export class CreateTrainingsCategoriesMetaDataDto extends BaseDto<CreateTrainingsCategoriesDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(CreateTrainingsCategoriesDto) }],
		type: () => CreateTrainingsCategoriesDto,
	})
	@ValidateNested()
	@Type(() => CreateTrainingsCategoriesDto)
	declare data: CreateTrainingsCategoriesDto;
}

export class UpdateTrainingsCategoriesDto {}
