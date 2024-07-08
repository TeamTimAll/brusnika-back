import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

import { BaseDto } from "../../../common/dto/abstract.dto";

export class NewsDto extends BaseDto {
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

export class LikeNewsDto {
	@ApiProperty({
		required: true,
		description: "News id",
	})
	@IsInt()
	@IsNotEmpty()
	id!: number;
}
