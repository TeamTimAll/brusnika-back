import { IsNotEmpty } from "class-validator";

export class CreateTrainingsViewsDto {
	@IsNotEmpty()
	user_id!: string;

	@IsNotEmpty()
	trainings_id!: string;
}

export class UpdateTrainingsViewsDto {}
