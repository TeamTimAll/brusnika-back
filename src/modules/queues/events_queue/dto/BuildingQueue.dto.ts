import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class BuildingQueueDto {
	@IsString()
	@IsNotEmpty()
	ext_id!: string;

	@IsString()
	@IsNotEmpty()
	name!: string;

	@IsNumber()
	@IsNotEmpty()
	total_storage!: number;

	@IsNumber()
	@IsNotEmpty()
	total_vacant_storage!: number;

	@IsNumber()
	@IsNotEmpty()
	total_apartment!: number;

	// vacant apartment
	@IsNumber()
	@IsNotEmpty()
	total_vacant_apartment!: number;

	// total parking space
	@IsNumber()
	@IsNotEmpty()
	total_parking_space!: number;

	// total vacant parking space
	@IsNumber()
	@IsNotEmpty()
	total_vacant_parking_space!: number;

	// commercial
	@IsNumber()
	@IsNotEmpty()
	total_commercial!: number;

	// vacant commercail
	@IsNumber()
	@IsNotEmpty()
	total_vacant_commercial!: number;

	@IsString()
	@IsNotEmpty()
	address!: string;

	@IsNumber()
	@IsNotEmpty()
	number_of_floors!: number;

	@IsString({ each: true })
	photos!: string[];

	@IsString()
	@IsNotEmpty()
	project_ext_id!: string;
}
