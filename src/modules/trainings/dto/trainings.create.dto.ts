import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsBoolean,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
} from "class-validator";

export class CreateTrainingsDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		description: "The title of the trainings",
		example: "The title of the trainings",
		required: true,
	})
	title!: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		description: "The content of the trainings",
		example: "111212.html",
		required: true,
	})
	content!: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		description: "The cover image of the trainings",
		example: "121212.png",
		required: true,
	})
	cover_image!: string;

	@IsOptional()
	@IsUUID()
	@ApiProperty({
		description: "The first category of the trainings",
		example: "The first category of the trainings",
		required: false,
	})
	primary_category_id!: number;

	@IsOptional()
	@IsUUID()
	@ApiProperty({
		description: "The second category of the trainings",
		example: "The second category of the trainings",
		required: false,
	})
	second_category_id!: number;

	@IsBoolean()
	@ApiProperty({
		description: "Is like enabled",
		required: true,
	})
	is_like_enabled!: boolean;

	@IsBoolean()
	@IsOptional()
	@ApiProperty({
		description: "Is extra like enabled",
		required: false,
	})
	is_extra_like_enabled!: boolean;

	@IsString()
	@IsOptional()
	@ApiProperty({
		description: "The extra like icon",
		required: false,
		example: "121212.png",
	})
	extra_like_icon!: string;

	@IsInt()
	@Type(() => Number)
	@IsOptional()
	user_id?: number;
}
