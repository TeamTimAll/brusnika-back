import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsDateString,
	IsEnum,
	IsInt,
	IsMobilePhone,
	IsOptional,
} from "class-validator";

import { Limit, Page } from "../../../decorators/pagination";
import { LeadOpStatus } from "../../leads/lead_ops.entity";
import { LeadState } from "../../leads/leads.entity";
import { FixingType } from "../client.entity";
import { Order } from "../../../constants";

export enum ClientSortBy {
	FULLNAME = "fullname",
	FIXING_TYPE = "fixing_type",
	ACTIVED_DATE = "actived_date",
	EXPIRATION_DATE = "expiration_date",
}

export class FilterClientDto {
	@ApiProperty({ required: false })
	@Page()
	page: number = 1;

	@ApiProperty({ required: false })
	@Limit()
	limit: number = 50;

	@ApiProperty({ required: false })
	@IsInt()
	@Type(() => Number)
	@IsOptional()
	client_id?: number;

	@ApiProperty({ required: false })
	@IsMobilePhone()
	@IsOptional()
	phone_number?: string;

	@ApiProperty({ required: false })
	@IsInt()
	@Type(() => Number)
	@IsOptional()
	project_id?: number;

	@ApiProperty({ required: false })
	@IsDateString()
	@IsOptional()
	actived_from_date?: Date;

	@ApiProperty({ required: false })
	@IsDateString()
	@IsOptional()
	actived_to_date?: Date;

	@ApiProperty({ required: false, enum: LeadOpStatus })
	@IsEnum(LeadOpStatus)
	@IsOptional()
	status?: LeadOpStatus;

	@ApiProperty({ required: false, enum: LeadState })
	@IsEnum(LeadState)
	@IsOptional()
	state?: string;

	@ApiProperty({ required: false, enum: FixingType })
	@IsEnum(FixingType)
	@IsOptional()
	fixing_type?: FixingType;

	@ApiProperty({ enum: ClientSortBy, required: false })
	@IsEnum(ClientSortBy)
	@IsOptional()
	sort_by?: ClientSortBy;

	@ApiProperty({ enum: Order, required: false })
	@IsEnum(Order)
	@IsOptional()
	order_by?: Order = Order.ASC;
}
