import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum } from "class-validator";

import { PremisesType } from "../../premises/premises.entity";
import { ExchangeRequestState } from "../exchange-request.entity";

export class FilterExchangeRequestDto {
	@ApiPropertyOptional()
	@Transform((data) => Number(data.value))
	client_id?: number;

	@ApiPropertyOptional({ enum: PremisesType })
	@IsEnum(PremisesType)
	premise_type?: PremisesType;

	@ApiPropertyOptional({ enum: ExchangeRequestState })
	@IsEnum(ExchangeRequestState)
	state?: ExchangeRequestState;
}
