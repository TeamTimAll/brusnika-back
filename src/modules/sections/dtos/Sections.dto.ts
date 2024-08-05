import { ApiPropertyOptional } from "@nestjs/swagger";

export class SectionsDto {
	@ApiPropertyOptional()
	name!: string;
}
