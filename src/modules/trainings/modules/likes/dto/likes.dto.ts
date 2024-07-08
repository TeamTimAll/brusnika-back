import { IsInt, IsNotEmpty } from "class-validator";

export class CreateTrainingsLikesDto {
	@IsInt()
	@IsNotEmpty()
	user_id!: number;

	@IsInt()
	@IsNotEmpty()
	trainings_id!: number;
}

export class UpdateTrainingsLikesDto {}
