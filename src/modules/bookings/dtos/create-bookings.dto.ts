import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsDate,
	IsEnum,
	IsMilitaryTime,
	IsOptional,
	IsUUID,
	ValidateNested,
} from "class-validator";

import { PuchaseOptions } from "../../premises/premises.entity";
import { BaseDto } from "../../../common/base/base_dto";
import { BookingStatus } from "../bookings.entity";

export class CreateBookingsDto {
	@IsUUID()
	@ApiProperty({ required: false, description: "ID of premise" })
	premise_id?: string;

	@IsUUID()
	@ApiProperty({ required: false, description: "ID of client" })
	client_id?: string;

	@IsUUID()
	@ApiProperty({ required: false, description: "ID of agent" })
	agent_id?: string;

	@IsDate()
	@ApiProperty({ required: true, description: "Date of booking" })
	date!: Date;

	@IsMilitaryTime()
	@ApiProperty({ required: true, description: "Time of booking" })
	time!: Date;

	@IsEnum(() => PuchaseOptions)
	@ApiProperty({
		required: true,
		description: "Purchase option",
		enum: PuchaseOptions,
	})
	purchase_option!: PuchaseOptions;

	@IsOptional()
	@IsEnum(() => BookingStatus)
	@ApiProperty({
		required: false,
		description: "Status of booking",
		enum: BookingStatus,
	})
	status?: BookingStatus;
}

export class CreateBookingsMetaDataDto extends BaseDto<CreateBookingsDto> {
	@ValidateNested()
	@Type(() => CreateBookingsDto)
	declare data: CreateBookingsDto;
}
