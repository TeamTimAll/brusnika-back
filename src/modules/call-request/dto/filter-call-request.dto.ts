import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class FilterCallRequestDto {
	@ApiPropertyOptional()
	@Transform((data) => Number(data.value))
	client_id?: number;

	@ApiPropertyOptional()
	@Transform((data) => Number(data.value))
	agent_id?: number;

	@ApiPropertyOptional()
	@Transform((data) => Number(data.value))
	premise_id?: number;
}
