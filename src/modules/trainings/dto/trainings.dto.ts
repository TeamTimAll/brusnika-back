import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsString, ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

export class TrainingsDto {
	@IsString()
	@IsNotEmpty()
	title!: string;

	@IsString()
	@IsNotEmpty()
	content!: string;

	@IsString()
	@IsNotEmpty()
	coverImage!: string;
}

export class LikeTrainingsDto {
	@IsInt()
	@Type(() => Number)
	@ApiProperty({
		required: true,
		description: "Trainings id",
	})
	@IsNotEmpty()
	id!: number;
}

export class LikeTrainingsMetaDataDto extends BaseDto<LikeTrainingsDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(LikeTrainingsDto) }],
		type: () => LikeTrainingsDto,
	})
	@ValidateNested()
	@Type(() => LikeTrainingsDto)
	declare data: LikeTrainingsDto;
}
