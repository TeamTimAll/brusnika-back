import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsInt, IsOptional } from "class-validator";

import { Limit, Page } from "../../../decorators";

export class ReadAllNewsDto {
	@ApiPropertyOptional()
	@Page()
	page: number = 1;

	@ApiPropertyOptional()
	@Limit()
	limit: number = 50;

	@ApiPropertyOptional({
		description: "City id",
	})
	@IsInt()
	@Type(() => Number)
	@IsOptional()
	city_id?: number;

	@ApiPropertyOptional({
		description: "Category id",
	})
	@IsInt()
	@Type(() => Number)
	@IsOptional()
	category_id?: number;

	@ApiPropertyOptional()
	@Transform(({ value }) => value === "true")
	@IsBoolean()
	@IsOptional()
	is_draft?: boolean;

	@ApiPropertyOptional()
	@Transform(({ value }) => value === "true")
	@IsBoolean()
	@IsOptional()
	is_banner?: boolean;

	@ApiPropertyOptional()
	@Transform(({ value }) => value === "true")
	@IsBoolean()
	@IsOptional()
	include_non_actives?: boolean;
}
