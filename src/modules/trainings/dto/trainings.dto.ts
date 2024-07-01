import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

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
	@IsString()
	@ApiProperty({
		required: true,
		description: "Trainings id",
	})
	@IsNotEmpty()
	id!: string;
}
