import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateTrainingsCategoriesDto {
	@ApiProperty({
		description: "Name of the category",
		example: "Politics",
	})
	@IsNotEmpty()
	name!: string;
}

export class UpdateTrainingsCategoriesDto {}
