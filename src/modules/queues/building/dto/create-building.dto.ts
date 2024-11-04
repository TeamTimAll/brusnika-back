import { Type } from "class-transformer";
import {
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
} from "class-validator";

import { BaseDto } from "common/base/base_dto";

export class BuildingDto {
	@IsString()
	@IsNotEmpty()
	ext_id!: string;

	@IsString()
	@IsNotEmpty()
	name!: string;

	@IsString()
	@IsNotEmpty()
	address!: string;

	@IsNumber()
	@IsNotEmpty()
	number_of_floors!: number;

	@IsOptional()
	@IsString({ each: true })
	photos!: string[];

	@IsString()
	@IsNotEmpty()
	project_ext_id!: string;
}

export class CreateBuildingMetaDataDto extends BaseDto<BuildingDto> {
	@ValidateNested()
	@Type(() => BuildingDto)
	declare data: BuildingDto;
}
