import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	ArrayNotEmpty,
	IsArray,
	IsDateString,
	IsInt,
	IsNotEmpty,
	IsString,
	ValidateNested,
} from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";
import { CreateBuildingDto } from "../../buildings/dtos";

class BuildingDto extends CreateBuildingDto {}

export class CreateProjectDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	photo!: string;

	@ApiProperty({
		example: "Project Name",
	})
	@IsString()
	@IsNotEmpty()
	name!: string;

	@ApiProperty({
		example: "Description about the project",
	})
	@IsNotEmpty()
	@IsString()
	description!: string;

	@ApiProperty({
		example: "Some address and some street.",
	})
	@IsNotEmpty()
	@IsString()
	address!: string;

	@ApiProperty({
		example: new Date(),
	})
	@IsNotEmpty()
	@IsDateString()
	end_date!: Date;

	@ApiProperty({
		example: "https://telegram.org",
	})
	@IsNotEmpty()
	@IsString()
	company_link!: string;

	@ApiProperty({
		example: "https://telegram.org",
	})
	@IsNotEmpty()
	@IsString()
	building_link!: string;

	@ApiProperty({
		example: "https://telegram.org",
	})
	@IsNotEmpty()
	@IsString()
	project_link!: string;

	@ApiProperty({ type: BuildingDto })
	@ArrayNotEmpty()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => BuildingDto)
	buildings!: BuildingDto[];

	@ApiProperty()
	@IsInt()
	@Type(() => Number)
	@IsNotEmpty()
	city_id!: number;

	@ApiProperty()
	@IsInt()
	@IsNotEmpty()
	price!: number;
}

export class CreateProjectMetaDataDto extends BaseDto<CreateProjectDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(CreateProjectDto) }],
		type: () => CreateProjectDto,
	})
	@ValidateNested()
	@Type(() => CreateProjectDto)
	declare data: CreateProjectDto;
}
