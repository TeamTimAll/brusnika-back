import {
	ApiProperty,
	ApiPropertyOptional,
	getSchemaPath,
} from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	ArrayNotEmpty,
	IsArray,
	IsDateString,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidateNested,
} from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";
import { UpdateBuildingWithIdDto } from "../../buildings/dtos";

export class CreateProjectDto {
	@ApiProperty()
	@IsArray()
	@IsString({ each: true })
	@IsNotEmpty()
	photos!: string[];

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
	location!: string;

	@ApiPropertyOptional({ example: "0.00" })
	@IsOptional()
	@IsString()
	long!: string;

	@ApiPropertyOptional({ example: "0.00" })
	@IsOptional()
	@IsString()
	lat!: string;

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

	@ApiProperty({ type: UpdateBuildingWithIdDto, isArray: true })
	@ArrayNotEmpty()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => UpdateBuildingWithIdDto)
	buildings!: UpdateBuildingWithIdDto[];

	@ApiProperty()
	@IsInt()
	@Type(() => Number)
	@IsNotEmpty()
	city_id!: number;

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
