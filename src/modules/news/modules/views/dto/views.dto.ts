import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";

export class CreateNewsViewsDto {
	@IsInt()
	@Type(() => Number)
	@IsNotEmpty()
	user_id!: number;

	@IsInt()
	@Type(() => Number)
	@IsNotEmpty()
	news_id!: number;
}

export class UpdateNewsViewsDto {}
