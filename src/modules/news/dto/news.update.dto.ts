import { IsOptional, IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateNewsDto {
	@IsUUID()
	@ApiProperty({
		required: true,
		description: "UUID of the news",
	})
	id!: string;

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
