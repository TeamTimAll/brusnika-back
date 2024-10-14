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

class BuildingDto {
	@IsNotEmpty()
	@IsString()
	@ApiProperty({
		example: "Premise name ",
		required: true,
		type: String,
	})
	name!: string;

	@IsNotEmpty()
	@ApiProperty({
		example: 22,
		description: "Total storage for the premise",
		type: Number,
	})
	total_storage!: number;

	@IsNotEmpty()
	@ApiProperty({
		example: 12,
		description: "Total  vacant storage for the premise",
		type: Number,
	})
	total_vacant_storage!: number;

	@IsNotEmpty()
	@ApiProperty({
		example: 22,
		description: "Total apartments",
		type: Number,
	})
	total_apartment!: number;

	// vacant apartment
	@IsNotEmpty()
	@ApiProperty({
		example: 12,
		description: "Total vacant apartment",
		type: Number,
	})
	total_vacant_apartment!: number;

	// total parking space
	@IsNotEmpty()
	@ApiProperty({
		example: 33,
		description: "Total parking space",
		type: Number,
	})
	total_parking_space!: number;

	// total vacant parking space
	@IsNotEmpty()
	@ApiProperty({
		example: 44,
		description: "Total vacant parking space ",
		type: Number,
	})
	total_vacant_parking_space!: number;

	// commercial
	@IsNotEmpty()
	@ApiProperty({
		example: 3,
		description: "Total commercial",
		type: Number,
	})
	total_commercial!: number;

	// vacant commercail
	@IsNotEmpty()
	@ApiProperty({
		example: 1,
		description: "Total vacant commercial",
		type: Number,
		required: true,
	})
	total_vacant_commercial!: number;

	@IsNotEmpty()
	@IsString()
	@ApiProperty({
		example: "Somewhere for premise address",
		type: String,
		required: true,
	})
	address!: string;

	@IsNotEmpty()
	@ApiProperty({
		example: 3,
		type: Number,
		required: true,
		description: "Number of floors for a building",
	})
	number_of_floors!: number;

	@ApiProperty({
		type: "array",
		description: "Images of the premise",
		required: true,
	})
	photos!: string[];

	project_id!: number;
}

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

	@ApiProperty({ type: BuildingDto, isArray: true })
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
