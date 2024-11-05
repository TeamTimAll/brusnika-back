import { IsNotEmpty, IsString } from "class-validator";

export class CityQueueDto {
	@IsString()
	ext_id!: string;

	@IsString()
	name!: string;

	@IsNotEmpty()
	@IsString()
	long!: string;

	@IsNotEmpty()
	@IsString()
	lat!: string;
}
