import { IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ProjectDto {
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
