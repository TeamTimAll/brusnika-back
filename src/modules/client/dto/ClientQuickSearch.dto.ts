import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class ClientQuickSearchDto {
	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	text?: string;
}
