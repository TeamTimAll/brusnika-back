import { IsNotEmpty } from "class-validator";

export class CreateNewsLikesDto {
	@IsNotEmpty()
	user_id!: string;

	@IsNotEmpty()
	news_id!: string;
}

export class UpdateNewsLikesDto {}
