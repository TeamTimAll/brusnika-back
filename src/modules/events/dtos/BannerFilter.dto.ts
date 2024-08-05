import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";

export class BannerFilterDto {
	@ApiProperty({
		required: false,
		description: "City id",
	})
	@IsInt()
	@Type(() => Number)
	@IsOptional()
	city_id?: number;
}
