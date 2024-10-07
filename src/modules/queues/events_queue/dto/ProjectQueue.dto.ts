import {
	IsDateString,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
} from "class-validator";

export class ProjectQueueDto {
	@IsString()
	ext_id!: string;

	@IsString()
	@IsNotEmpty()
	name!: string;

	@IsOptional()
	@IsString()
	description!: string;

	@IsNotEmpty()
	@IsString()
	detailed_description!: string;

	@IsNotEmpty()
	@IsString()
	brief_description!: string;

	@IsNotEmpty()
	@IsNumber()
	price!: number;

	@IsNotEmpty()
	@IsString()
	location!: string;

	@IsNotEmpty()
	@IsDateString()
	end_date!: Date;

	@IsString()
	photo!: string;

	@IsOptional()
	@IsString()
	long!: string;

	@IsOptional()
	@IsString()
	lat!: string;

	@IsOptional()
	@IsString()
	link!: string;

	@IsString()
	@IsNotEmpty()
	city_ext_id!: string;
}
