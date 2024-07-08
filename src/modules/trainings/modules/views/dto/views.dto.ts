import { IsInt, IsNotEmpty } from "class-validator";

export class CreateTrainingsViewsDto {
	@IsInt()
	@IsNotEmpty()
	user_id!: number;

	@IsInt()
	@IsNotEmpty()
	trainings_id!: number;
}

export class UpdateTrainingsViewsDto {}
