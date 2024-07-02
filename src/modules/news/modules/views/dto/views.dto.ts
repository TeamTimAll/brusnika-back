import { IsNotEmpty } from "class-validator";

export class CreateNewsViewsDto {
	@IsNotEmpty()
	user_id!: string;

	@IsNotEmpty()
	news_id!: string;
}

export class UpdateNewsViewsDto {}
