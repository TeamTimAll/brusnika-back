import { IsInt, IsNotEmpty } from "class-validator";

export class CreateNewsLikesDto {
	@IsInt()
	@IsNotEmpty()
	user_id!: number;

	@IsInt()
	@IsNotEmpty()
	news_id!: number;
}

export class UpdateNewsLikesDto {}
