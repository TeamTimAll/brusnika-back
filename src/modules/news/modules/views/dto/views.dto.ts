import { IsNotEmpty } from "class-validator";

import { Uuid } from "boilerplate.polyfill";

export class CreateNewsViewsDto {
	@IsNotEmpty()
	user_id!: Uuid;

	@IsNotEmpty()
	news_id!: Uuid;
}

export class UpdateNewsViewsDto {}
