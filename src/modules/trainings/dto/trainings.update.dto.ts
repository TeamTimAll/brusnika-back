import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString } from "class-validator";

export class UpdateTrainingsDto {
	@IsInt()
	@Type(() => Number)
	@ApiProperty({
		required: true,
		description: "UUID of the trainings",
	})
	id!: number;

	@IsString()
	@ApiProperty({
		required: false,
		description: "Title of the trainings",
	})
	@IsOptional()
	title?: string;

	@IsString()
	@ApiProperty({
		required: false,
		description: "Content of the trainings",
	})
	@IsOptional()
	content?: string;

	@IsString()
	@ApiProperty({
		required: false,
		description: "Image URL",
	})
	@IsOptional()
	cover_image?: string;
}
