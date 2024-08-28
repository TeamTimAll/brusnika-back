import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsOptional } from "class-validator";

export class TrainingCategoryFilterDto {
	@ApiProperty({ required: false })
	@Transform(({ value }) => value === "true")
	@IsBoolean()
	@IsOptional()
	include_non_actives?: boolean;
}
