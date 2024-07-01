import { IsOptional, IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateTrainingsDto {
	@IsUUID()
	@ApiProperty({
		required: true,
		description: "UUID of the trainings",
	})
	id!: string;

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
