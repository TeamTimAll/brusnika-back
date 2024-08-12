import { ApiProperty } from "@nestjs/swagger";

export class DraftResponseDto {
	@ApiProperty()
	is_draft!: boolean;
}
