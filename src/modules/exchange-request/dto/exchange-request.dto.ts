import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { BaseDto, Dto } from "../../../common/base/base_dto";
import { ClientEntity } from "../../client/client.entity";
import { PremisesType } from "../../premises/premises.entity";
import { UserEntity } from "../../user/user.entity";
import {
	ExchangeRequestOpsEntity,
	ExchangeRequestStatus,
} from "../exchange-request-ops.entity";
import {
	AccommodationType,
	ExchangeRequestEntity,
	ExchangeRequestState,
	PremiseCondition,
} from "../exchange-request.entity";

type IExchangeRequestDto = Omit<ExchangeRequestEntity, "ext_id">;

export class ExchangeRequestDto implements IExchangeRequestDto {
	@ApiProperty()
	id!: number;

	@ApiProperty()
	created_at!: Date;

	@ApiProperty()
	updated_at!: Date;

	@ApiProperty({ enum: AccommodationType })
	accommodation_type!: AccommodationType;

	@ApiPropertyOptional()
	advertisement_link?: string;

	@ApiProperty()
	agency_price!: number;

	@ApiProperty()
	apartment_number!: number;

	@ApiProperty()
	city!: string;

	@ApiProperty({ type: ClientEntity })
	client!: ClientEntity;

	@ApiProperty()
	client_id!: number;

	@ApiProperty({ type: UserEntity })
	agent!: UserEntity;

	@ApiProperty()
	agent_id!: number;

	@ApiProperty()
	client_price!: number;

	@ApiProperty()
	construction_year!: number;

	@ApiProperty()
	floor!: number;

	@ApiProperty({ enum: ExchangeRequestState })
	state!: ExchangeRequestState;

	@ApiProperty()
	has_encumbrances!: boolean;

	@ApiProperty()
	has_mortgage!: boolean;

	@ApiProperty()
	house_number!: number;

	@ApiProperty()
	is_active!: boolean;

	@ApiProperty()
	living_area!: number;

	@ApiProperty()
	number_of_floors!: number;

	@ApiProperty({ enum: PremiseCondition })
	premise_condition!: PremiseCondition;

	@ApiProperty({ enum: PremisesType })
	premise_type!: PremisesType;

	@ApiProperty()
	room_count!: number;

	@ApiProperty()
	street!: string;

	@ApiProperty()
	total_area!: number;

	@ApiProperty()
	current_status!: ExchangeRequestStatus;

	@ApiProperty()
	exchange_request_ops!: ExchangeRequestOpsEntity[];
}

export class ExchangeRequestMetaDataDto
	extends BaseDto<ExchangeRequestDto>
	implements Dto
{
	@ApiProperty({ type: ExchangeRequestDto })
	declare data: ExchangeRequestDto;

	desc = "### Exchange Request ma'lumotlari";
}

export class ExchangeRequestArrayMetaDataDto extends BaseDto<
	ExchangeRequestDto[]
> {
	@ApiProperty({ type: ExchangeRequestDto, isArray: true })
	declare data: ExchangeRequestDto[];

	desc = "### Exchange Request ma'lumotlari";
}
