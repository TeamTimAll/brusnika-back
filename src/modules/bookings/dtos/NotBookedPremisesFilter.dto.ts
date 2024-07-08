import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsNotEmpty, IsOptional } from "class-validator";
import { Type } from "class-transformer";

import { PremisesType } from "../../leads/lead_ops.entity";

export class NotBookedPremisesFilter {
	@ApiProperty({
		enum: PremisesType,
		description: "Premises type",
		required: false,
	})
	@IsOptional()
	@IsEnum(PremisesType)
	type?: PremisesType;

	@ApiProperty({
		example: 1,
	})
	@IsNotEmpty()
	@IsInt()
	@Type(() => Number)
	building_id!: number;
}
