import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsInt, IsOptional, IsString } from "class-validator";

export class FilterTrainingDto {
	@ApiProperty({ required: false })
	@Type(() => Number)
	@IsInt()
	@IsOptional()
	category_id?: number;

	@ApiProperty({ required: false })
	@Transform(({ value }) => value === "true")
	@IsBoolean()
	@IsOptional()
	include_non_actives?: boolean;

	@ApiProperty()
	@IsString()
	@IsOptional()
	text?: string;

	@ApiProperty({ required: false })
	@Transform(({ value }) => value === "true")
	@IsBoolean()
	@IsOptional()
	is_show?: boolean;
}
