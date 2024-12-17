import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsEnum, IsInt, IsOptional } from "class-validator";

import { Order } from "../../../constants";
import { Limit, Page } from "../../../decorators";
import { LeadOpStatus, PremisesType } from "../lead_ops.entity";
import { LeadState } from "../leads.entity";

export class LeadReadByFilterDto {
	@ApiProperty({ required: false })
	@Page()
	page: number = 1;

	@ApiProperty({ required: false })
	@Limit()
	limit: number = 100;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsInt()
	@Type(() => Number)
	project_id?: number;

	@ApiProperty({ required: false, enum: PremisesType })
	@IsOptional()
	@IsEnum(PremisesType)
	premise_type?: PremisesType;

	@ApiPropertyOptional()
	@Transform(({ value }) => value === "true")
	@IsBoolean()
	@IsOptional()
	is_finished?: boolean;

	@ApiPropertyOptional()
	@Transform(({ value }) => value === "true")
	@IsBoolean()
	@IsOptional()
	is_initial?: boolean;

	@ApiProperty({ required: false, enum: LeadOpStatus })
	@IsOptional()
	@Transform(({ value }) => (value as string).toLowerCase())
	@IsEnum(LeadOpStatus)
	status?: LeadOpStatus;

	@ApiPropertyOptional({ enum: LeadState })
	@IsOptional()
	@IsEnum(LeadState)
	state?: LeadState;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsInt()
	@Type(() => Number)
	client_id?: number;

	@ApiProperty({ required: false, enum: Order })
	@IsOptional()
	@IsEnum(Order)
	createdAt?: Order;
}
