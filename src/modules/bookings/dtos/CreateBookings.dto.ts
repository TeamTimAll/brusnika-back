import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsDateString,
	IsEnum,
	IsInt,
	IsMilitaryTime,
	IsOptional,
	ValidateNested,
} from "class-validator";

import { BaseDto } from "../../../common/base/base_dto";
import { PuchaseOptions } from "../../premises/premises.entity";
import { BookingStatus } from "../bookings.entity";

export class CreateBookingsDto {
	@ApiProperty({ required: false, description: "ID of premise" })
	@IsInt()
	@Type(() => Number)
	premise_id?: number;

	@ApiProperty({ required: false, description: "ID of client" })
	@IsInt()
	@Type(() => Number)
	client_id?: number;

	// @ApiProperty({ required: false, description: "ID of agent" })
	// @IsOptional()
	// @IsInt()
	// @Type(() => Number)
	// agent_id?: number;

	@ApiProperty({
		required: true,
		description: "Date of booking",
		default: new Date(),
	})
	@IsDateString()
	date!: string;

	@ApiProperty({
		required: true,
		description: "Time of booking",
		default: "00:00",
	})
	@IsMilitaryTime()
	time!: string;

	@IsEnum(PuchaseOptions)
	@ApiProperty({
		required: true,
		description: "Purchase option",
		enum: PuchaseOptions,
	})
	purchase_option!: PuchaseOptions;

	@IsOptional()
	@IsEnum(BookingStatus)
	@ApiProperty({
		required: false,
		description: "Status of booking",
		enum: BookingStatus,
	})
	status?: BookingStatus;
}

export class CreateBookingsMetaDataDto extends BaseDto<CreateBookingsDto> {
	@ApiProperty({
		oneOf: [{ $ref: getSchemaPath(CreateBookingsDto) }],
		type: () => CreateBookingsDto,
	})
	@ValidateNested()
	@Type(() => CreateBookingsDto)
	declare data: CreateBookingsDto;
}
