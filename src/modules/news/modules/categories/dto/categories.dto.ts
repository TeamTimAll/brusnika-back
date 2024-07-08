import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateNewsCategoriesDto {
	@ApiProperty({
		description: "Name of the category",
		example: "Politics",
	})
	@IsNotEmpty()
	name!: string;
}

export class UpdateNewsCategoriesDto {}
