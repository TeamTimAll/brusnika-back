import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

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
