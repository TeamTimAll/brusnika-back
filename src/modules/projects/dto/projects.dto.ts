import {
	IsDateString,
	IsInt,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
} from "class-validator";

import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { BaseDto } from "../../../common/dto/abstract.dto";

export class ProjectDto extends BaseDto {
	@IsNotEmpty()
	@IsString()
	title!: string;

	@IsNotEmpty()
	@IsString()
	description!: string;

	@IsNotEmpty()
	@IsString()
	userId!: string;

	@IsNumber()
	@IsNotEmpty()
	price!: number;

	@IsNotEmpty()
	@IsString()
	location!: string;

	@IsNotEmpty()
	@IsDateString()
	end_date!: Date;
}

export class ProjectFilterDto {
	@ApiProperty({ required: false })
	@IsOptional()
	@IsInt()
	@Type(() => Number)
	city_id?: number;
}
