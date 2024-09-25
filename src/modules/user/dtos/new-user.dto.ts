import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsDateString,
	IsEnum,
	IsInt,
	IsOptional,
	IsString,
} from "class-validator";

import { Order } from "../../../constants";
import { Limit, Page } from "../../../decorators";

import { UserSortBy } from "./UserFilter.dto";

export class NewUserFilterDto {
	@ApiProperty({ required: false })
	@Page()
	page: number = 1;

	@ApiProperty({ required: false })
	@Limit()
	limit: number = 50;

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	text?: string;

	@ApiProperty({ required: false })
	@IsInt()
	@Type(() => Number)
	@IsOptional()
	city_id?: number;

	@ApiProperty({ required: false })
	@IsDateString()
	@IsOptional()
	registered_at?: string;

	@ApiProperty({ enum: UserSortBy, required: false })
	@IsEnum(UserSortBy)
	@IsOptional()
	sort_by?: UserSortBy;

	@ApiProperty({ enum: Order, required: false })
	@IsEnum(Order)
	@IsOptional()
	order_by?: Order = Order.ASC;
}
