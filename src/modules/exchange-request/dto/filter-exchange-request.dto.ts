import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsOptional } from "class-validator";

import { PremisesType } from "../../premises/premises.entity";
import { ExchangeRequestState } from "../exchange-request.entity";
import { Order } from "../../../constants";

export class FilterExchangeRequestDto {
	@ApiPropertyOptional()
	@IsOptional()
	@Transform((data) => Number(data.value))
	client_id?: number;

	@ApiPropertyOptional({ enum: PremisesType })
	@IsOptional()
	@IsEnum(PremisesType)
	premise_type?: PremisesType;

	@ApiPropertyOptional({ enum: ExchangeRequestState })
	@IsOptional()
	@IsEnum(ExchangeRequestState)
	state?: ExchangeRequestState;

	@ApiPropertyOptional({ enum: Order })
	@IsOptional()
	@IsEnum(Order)
	createdAt?: Order;
}
