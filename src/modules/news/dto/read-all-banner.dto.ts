import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsInt, IsOptional } from "class-validator";

export class ReadAllBannerNewsDto {
	@ApiPropertyOptional({
		description: "City id",
	})
	@IsInt()
	@Type(() => Number)
	@IsOptional()
	city_id?: number;

	@ApiPropertyOptional()
	@Transform(({ value }) => value === "true")
	@IsBoolean()
	@IsOptional()
	is_draft?: boolean;
}
