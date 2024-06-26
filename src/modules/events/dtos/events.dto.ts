import { ApiPropertyOptional } from "@nestjs/swagger";

import { BaseDto } from "../../../common/dto/abstract.dto";

export class EventsDto extends BaseDto {
	@ApiPropertyOptional()
	title?: string;

	@ApiPropertyOptional()
	description?: string;

	@ApiPropertyOptional()
	info?: string;
}
