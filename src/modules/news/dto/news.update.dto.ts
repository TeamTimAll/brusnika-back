import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString } from "class-validator";

export class UpdateNewsDto {
	@ApiProperty({
		required: true,
		description: "UUID of the news",
	})
	@IsInt()
	id!: number;

	@IsString()
	@ApiProperty({
		required: false,
		description: "Title of the news",
	})
	@IsOptional()
	title?: string;

	@IsString()
	@ApiProperty({
		required: false,
		description: "Content of the news",
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
