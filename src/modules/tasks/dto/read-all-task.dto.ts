import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsEnum, IsOptional } from "class-validator";

import { Order } from "../../../constants";
import { Limit, Page } from "../../../decorators";

export enum TaskSortBy {
	CLIENT_FULLNAME = "client_fullname",
	TASK_TYPE = "task_type",
	END_DATE = "end_date",
	PROJECT_NAME = "project_name",
}

export class ReadAllTasksDto {
	@ApiPropertyOptional()
	@Page()
	page: number = 1;

	@ApiPropertyOptional()
	@Limit()
	limit: number = 50;

	@ApiPropertyOptional()
	@Transform(({ value }) => value === "true")
	@IsBoolean()
	@IsOptional()
	is_archived?: boolean;

	@ApiPropertyOptional({ enum: TaskSortBy })
	@IsEnum(TaskSortBy)
	@IsOptional()
	sort_by?: TaskSortBy;

	@ApiPropertyOptional({ enum: Order })
	@IsEnum(Order)
	@IsOptional()
	order_by?: Order = Order.ASC;
}
