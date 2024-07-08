import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";

export class CreateTrainingsViewsDto {
	@IsInt()
	@Type(() => Number)
	@IsNotEmpty()
	user_id!: number;

	@IsInt()
	@Type(() => Number)
	@IsNotEmpty()
	trainings_id!: number;
}

export class UpdateTrainingsViewsDto {}
