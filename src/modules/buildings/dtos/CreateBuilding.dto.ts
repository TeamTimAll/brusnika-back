import {
	ApiProperty,
	ApiPropertyOptional,
	getSchemaPath,
} from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidateNested,
} from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

export class CreateBuildingDto {
	@IsNotEmpty()
	@IsString()
	@ApiProperty({
		example: "Premise name ",
		required: true,
		type: String,
	})
	name!: string;

	@ApiPropertyOptional({
		example: "Somewhere for premise address",
	})
	@IsOptional()
	@IsString()
	address?: string;

	@IsOptional()
	@ApiPropertyOptional({
		description: "Number of floors for a building",
	})
	number_of_floors?: number;

	@ApiPropertyOptional({
		description: "Images of the premise",
	})
	photos?: string[];

	@IsNotEmpty()
	@ApiProperty({
		required: true,
		example: 0,
	})
	project_id!: number;
}

export class CreateBuildingMetaDto extends BaseDto<CreateBuildingDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(CreateBuildingDto) }],
		type: () => CreateBuildingDto,
	})
	@ValidateNested()
	@Type(() => CreateBuildingDto)
	declare data: CreateBuildingDto;
}
