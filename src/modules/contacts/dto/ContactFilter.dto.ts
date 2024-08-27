import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";

export class ContactFilterDto {
	@ApiProperty({ required: false })
	@Type(() => Number)
	@IsInt()
	@IsOptional()
	city_id?: number;
}
