import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

import { NEWS_CATEGORIES } from "../news.entity";

export class CreateNewsDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		description: "The title of the news",
		example: "The title of the news",
		required: true,
	})
	title!: string;

	@IsString()
	@IsNotEmpty()
	content!: string;

	@IsString()
	@IsNotEmpty()
	coverImage!: string;

	@IsNotEmpty()
	category!: NEWS_CATEGORIES;
}
