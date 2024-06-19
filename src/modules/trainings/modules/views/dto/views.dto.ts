import { IsNotEmpty } from "class-validator";

import { Uuid } from "boilerplate.polyfill";

export class CreateTrainingsViewsDto {
	@IsNotEmpty()
	user_id!: Uuid;

	@IsNotEmpty()
	trainings_id!: Uuid;
}

export class UpdateTrainingsViewsDto {}
