import { IsInt, IsNotEmpty } from "class-validator";

export class CreateNewsViewsDto {
	@IsInt()
	@IsNotEmpty()
	user_id!: number;

	@IsInt()
	@IsNotEmpty()
	news_id!: number;
}

export class UpdateNewsViewsDto {}
