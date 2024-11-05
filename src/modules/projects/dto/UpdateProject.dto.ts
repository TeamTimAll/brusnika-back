import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import {
	ArrayNotEmpty,
	IsArray,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

import { CreateProjectDto } from "./CreateProject.dto";

export class UpdateBuildingInProjectDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsInt()
	id!: number;

	@ApiProperty({
		example: "Building name",
		type: String,
	})
	@IsNotEmpty()
	@IsString()
	name!: string;

	@ApiProperty({
		example: "Somewhere for premise address",
		type: String,
		required: false,
	})
	@IsOptional()
	@IsString()
	address?: string;

	@ApiProperty({
		example: 3,
		type: Number,
		required: false,
		description: "Number of floors for a building",
	})
	@IsOptional()
	number_of_floors?: number;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	object_id!: string;

	project_id!: number;
}

export class UpdateProjectDto extends CreateProjectDto {
	@ApiProperty({ type: UpdateBuildingInProjectDto, isArray: true })
	@ArrayNotEmpty()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => UpdateBuildingInProjectDto)
	buildings: UpdateBuildingInProjectDto[] = [];
}

export class UpdateProjectMetaDataDto {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(UpdateProjectDto) }],
		type: () => UpdateProjectDto,
	})
	@ValidateNested()
	@Type(() => UpdateProjectDto)
	declare data: UpdateProjectDto;
}
