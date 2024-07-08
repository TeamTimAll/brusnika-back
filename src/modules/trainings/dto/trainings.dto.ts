import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

import { BaseDto } from "../../../common/dto/abstract.dto";

export class TrainingsDto extends BaseDto {
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
