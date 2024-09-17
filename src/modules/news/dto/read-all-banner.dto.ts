import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";

export class ReadAllBannerNewsDto {
	@ApiPropertyOptional({
		description: "City id",
	})
	@IsInt()
	@Type(() => Number)
	@IsOptional()
	city_id?: number;
}
