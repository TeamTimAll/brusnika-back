import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	ArrayMinSize,
	IsArray,
	IsNotEmpty,
	IsString,
	ValidateNested
} from "class-validator";


import { BaseDto } from "../../../common/base/base_dto";

export class UpdateBuilding {
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
}

export class UpdateBuildingMetaDataDto extends BaseDto<UpdateBuilding> {
	@ApiProperty({
		example: [
			{
				name: "building name",
				total_storage: 22,
				total_vacant_storage: 12,
				total_apartment: 22,
				total_vacant_apartment: 12,
				total_parking_space: 33,
				total_vacant_parking_space: 44,
				total_commercial: 3,
				total_vacant_commercial: 1,
				address: "Somewhere for building address",
				number_of_floors: 3,
			} as UpdateBuilding,
		],
	})
	@IsArray()
	@ValidateNested({ each: true })
	@ArrayMinSize(1)
	@Type(() => UpdateBuilding)
	declare data: UpdateBuilding[];
}
