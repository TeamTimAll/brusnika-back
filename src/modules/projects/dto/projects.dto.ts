import { IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";

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
