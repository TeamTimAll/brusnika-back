import {
	ApiProperty,
	ApiPropertyOptional,
	getSchemaPath,
} from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsBoolean,
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Min,
	ValidateNested,
} from "class-validator";

import { PremisesType } from "../../premises/premises.entity";
import { BaseDto } from "../../../common/base/base_dto";
import {
	AccommodationType,
	PremiseCondition,
} from "../exchange-request.entity";

export class CreateExchangeRequestDto {
	@ApiProperty()
	@IsInt()
	@IsNotEmpty()
	client_id!: number;

	@ApiProperty({ enum: AccommodationType })
	@IsEnum(AccommodationType)
	@IsNotEmpty()
	accommodation_type!: AccommodationType;

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	advertisement_link?: string;

	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	agency_price!: number;

	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	apartment_number!: number;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	city!: string;

	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	client_price!: number;

	@ApiProperty()
	@IsNotEmpty()
	@IsNumber()
	@Min(1)
	construction_year!: number;

	@ApiProperty()
	@IsNotEmpty()
	@IsNumber()
	floor!: number;

	@ApiProperty()
	@IsBoolean()
	@IsNotEmpty()
	has_encumbrances!: boolean;

	@ApiProperty()
	@IsBoolean()
	@IsNotEmpty()
	has_mortgage!: boolean;

	@ApiProperty()
	@IsNotEmpty()
	@IsNumber()
	house_number!: number;

	@ApiProperty()
	@IsNotEmpty()
	@IsNumber()
	@Min(1)
	living_area!: number;

	@ApiProperty()
	@IsNotEmpty()
	@IsNumber()
	number_of_floors!: number;

	@ApiProperty({ enum: PremiseCondition })
	@IsEnum(PremiseCondition)
	@IsNotEmpty()
	premise_condition!: PremiseCondition;

	@ApiProperty({ enum: PremisesType })
	@IsEnum(PremisesType)
	@IsNotEmpty()
	premise_type!: PremisesType;

	@ApiProperty()
	@IsNotEmpty()
	@IsNumber()
	@Min(1)
	room_count!: number;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	street!: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsNumber()
	@Min(1)
	total_area!: number;
}

export class CreateExchangeRequestMetaDataDto extends BaseDto<CreateExchangeRequestDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(CreateExchangeRequestDto) }],
		type: () => CreateExchangeRequestDto,
	})
	@ValidateNested()
	@Type(() => CreateExchangeRequestDto)
	declare data: CreateExchangeRequestDto;
}
