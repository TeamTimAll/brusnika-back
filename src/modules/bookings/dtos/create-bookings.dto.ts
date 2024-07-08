import { ApiProperty } from "@nestjs/swagger";
import {
	IsDateString,
	IsEnum,
	IsInt,
	IsMilitaryTime,
	IsOptional
} from "class-validator";

import { PuchaseOptions } from "../../premises/premises.entity";
import { BookingStatus } from "../bookings.entity";

export class CreateBookingsDto {
	@ApiProperty({ required: false, description: "ID of premise" })
	@IsInt()
	premise_id?: number;

	@ApiProperty({ required: false, description: "ID of client" })
	@IsInt()
	client_id?: number;

	// @ApiProperty({ required: false, description: "ID of agent" })
	@IsOptional()
	@IsInt()
	agent_id?: number;

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
