import { ApiProperty } from "@nestjs/swagger";
import {
	IsDateString,
	IsEnum,
	IsMilitaryTime,
	IsOptional,
	IsUUID,
} from "class-validator";

import { Uuid } from "boilerplate.polyfill";

import { PuchaseOptions } from "../../premises/premises.entity";
import { BookingStatus } from "../bookings.entity";

export class CreateBookingsDto {
	@IsUUID()
	@ApiProperty({ required: false, description: "ID of premise" })
	premise_id?: Uuid;

	@IsUUID()
	@ApiProperty({ required: false, description: "ID of client" })
	client_id?: Uuid;

	@IsUUID()
	@IsOptional()
	// @ApiProperty({ required: false, description: "ID of agent" })
	agent_id?: Uuid;

	@IsDateString()
	@ApiProperty({ required: true, description: "Date of booking" })
	date!: string;

	@IsMilitaryTime()
	@ApiProperty({ required: true, description: "Time of booking" })
	time!: Date;

	@IsEnum(PuchaseOptions)
	@ApiProperty({
		required: true,
		description: "Purchase option",
		enum: PuchaseOptions,
	})
	purchase_option!: PuchaseOptions;

	@IsOptional()
	@IsEnum( BookingStatus)
	@ApiProperty({
		required: false,
		description: "Status of booking",
		enum: BookingStatus,
	})
	status?: BookingStatus;
}

// export class CreateBookingsMetaDataDto extends BaseDto<CreateBookingsDto> {
// 	// @ApiProperty({
// 	// 	oneOf: [{ $ref: getSchemaPath(CreateBookingsDto) }],
// 	// 	type: () => CreateBookingsDto,
// 	// })
// 	// @ValidateNested()
// 	// @Type(() => CreateBookingsDto)
// 	declare data: CreateBookingsDto;
// }
