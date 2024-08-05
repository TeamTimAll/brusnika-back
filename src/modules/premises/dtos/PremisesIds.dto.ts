import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";

import { Limit, Page } from "../../../decorators/pagination";

export class PremisesIdsDto {
	@ApiProperty({ required: false })
	@Page()
	page: number = 1;

	@ApiProperty({ required: false })
	@Limit()
	limit: number = 50;

	@ApiProperty({ required: false, type: [Number] })
	@IsInt({ each: true })
	@Type(() => Number)
	@IsOptional()
	ids?: number[];
}
