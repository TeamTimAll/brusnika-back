import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

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
	@IsString()
	@ApiProperty({
		required: true,
		description: "News id",
	})
	@IsNotEmpty()
	id!: string;
}
