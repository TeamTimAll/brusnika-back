import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsString, ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

export class UpdateTrainingsDto {
	@IsString()
	@ApiProperty({
		required: false,
		description: "Title of the trainings",
	})
	@IsOptional()
	title?: string;

	@IsString()
	@ApiProperty({
		required: false,
		description: "Content of the trainings",
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

export class UpdateTrainingsMetaDataDto extends BaseDto<UpdateTrainingsDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(UpdateTrainingsDto) }],
		type: () => UpdateTrainingsDto,
	})
	@ValidateNested()
	@Type(() => UpdateTrainingsDto)
	declare data: UpdateTrainingsDto;
}
