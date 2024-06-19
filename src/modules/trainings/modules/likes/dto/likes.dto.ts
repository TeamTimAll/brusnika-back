import { IsNotEmpty } from "class-validator";

import { Uuid } from "boilerplate.polyfill";

export class CreateTrainingsLikesDto {
	@IsNotEmpty()
	user_id!: Uuid;

	@IsNotEmpty()
	trainings_id!: Uuid;
}

export class UpdateTrainingsLikesDto {}
