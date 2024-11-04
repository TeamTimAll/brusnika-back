import { Type } from "class-transformer";
import {
	IsDateString,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
} from "class-validator";

import { BaseDto } from "common/base/base_dto";

export class ProjectDto {
	@IsString()
	ext_id!: string;

	@IsString()
	photo!: string;

	@IsString()
	@IsNotEmpty()
	name!: string;

	@IsOptional()
	@IsString()
	description!: string;

	@IsNotEmpty()
	@IsString()
	location!: string;

	@IsOptional()
	@IsString()
	long!: string;

	@IsOptional()
	@IsString()
	lat!: string;

	@IsNotEmpty()
	@IsDateString()
	end_date!: Date;

	@IsNotEmpty()
	@IsString()
	company_link!: string;

	@IsNotEmpty()
	@IsString()
	building_link!: string;

	@IsNotEmpty()
	@IsString()
	project_link!: string;

	@IsNotEmpty()
	@IsNumber()
	price!: number;

	@IsString()
	@IsNotEmpty()
	city_ext_id!: string;
}

export class CreateProjectMetaDataDto extends BaseDto<ProjectDto> {
	@ValidateNested()
	@Type(() => ProjectDto)
	declare data: ProjectDto;
}
