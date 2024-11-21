import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsInt, IsNotEmpty, IsOptional } from "class-validator";

export class TimeSlotDto {
	@ApiProperty()
	@IsNotEmpty()
	@Type(() => Number)
	@IsInt()
	project_id!: number;

	@ApiPropertyOptional()
	@Transform(({ value }) => value === "true")
	@IsBoolean()
	@IsOptional()
	debug?: boolean;
}
