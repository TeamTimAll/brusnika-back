import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsOptional } from "class-validator";

import { Limit, Page } from "../../../decorators";

export class ReadAllTasksDto {
	@ApiPropertyOptional()
	@Page()
	page: number = 1;

	@ApiPropertyOptional()
	@Limit()
	limit: number = 50;

	@ApiPropertyOptional()
	@Transform(({ value }) => value === "true")
	@IsBoolean()
	@IsOptional()
	is_closed?: boolean;
}
