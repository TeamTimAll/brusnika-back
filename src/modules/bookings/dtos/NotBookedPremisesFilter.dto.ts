import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from "class-validator";

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
		example: "123e4567-e89b-12d3-a456-426614174000",
	})
	@IsNotEmpty()
	@IsUUID()
	building_id!: string;
}
