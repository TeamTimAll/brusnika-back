import { IsNotEmpty } from "class-validator";

export class CreateTrainingsLikesDto {
	@IsNotEmpty()
	user_id!: string;

	@IsNotEmpty()
	trainings_id!: string;
}

export class UpdateTrainingsLikesDto {}
