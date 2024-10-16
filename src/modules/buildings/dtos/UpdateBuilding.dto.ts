import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsString, ValidateNested } from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";

export class UpdateBuildingDto {
	@IsNotEmpty()
	@IsString()
	@ApiProperty({
		example: "Premise name ",
		required: true,
		type: String,
	})
	name!: string;

	@IsNotEmpty()
	@IsString()
	@ApiProperty({
		example: "Somewhere for premise address",
		type: String,
		required: true,
	})
	address?: string;

	@IsNotEmpty()
	@ApiProperty({
		example: 3,
		type: Number,
		required: true,
		description: "Number of floors for a building",
	})
	number_of_floors?: number;
}

export class UpdateBuildingMetaDataDto extends BaseDto<UpdateBuildingDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(UpdateBuildingDto) }],
		type: () => UpdateBuildingDto,
	})
	@ValidateNested()
	@Type(() => UpdateBuildingDto)
	declare data: UpdateBuildingDto;
}
