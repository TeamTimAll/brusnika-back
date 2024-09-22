import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt } from "class-validator";
import { Transform } from "class-transformer";

import { ExchangeRequestState } from "../exchange-request.entity";

import {
	CreateExchangeRequestDto,
	CreateExchangeRequestMetaDataDto,
} from "./create-exchange-request.dto";

export class UpdateExchangeRequestDto extends CreateExchangeRequestDto {}

export class UpdateExchangeRequestMetaDataDto extends CreateExchangeRequestMetaDataDto {}

export class UpdateExchangeRequestStatusDto {
	@ApiProperty()
	@Transform((data) => Number(data.value))
	@IsInt()
	id!: number;

	@ApiProperty()
	@IsEnum(ExchangeRequestState)
	state!: ExchangeRequestState;
}
