import { IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

import { NEWS_CATEGORIES } from "../news.entity";

export class UpdateNewsDto {
	id!: string;
	@IsString()
	@IsOptional()
	title?: string;

	@IsString()
	@IsOptional()
	content?: string;

	@IsString()
	@IsOptional()
	coverImage?: string;

	@IsOptional()
	@Transform(({ value }) => value.toUpperCase())
	category?: NEWS_CATEGORIES;
}
