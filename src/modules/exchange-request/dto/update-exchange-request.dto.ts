import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt } from "class-validator";
import { Transform } from "class-transformer";

import { ExchangeRequestStatus } from "../exchange-request-ops.entity";

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

	@ApiProperty({ enum: ExchangeRequestStatus })
	@IsEnum(ExchangeRequestStatus)
	status!: ExchangeRequestStatus;
}
