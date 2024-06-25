import { ApiProperty } from "@nestjs/swagger";
import { Uuid } from "boilerplate.polyfill";
import { IsDate, IsEnum, IsMilitaryTime, IsOptional, IsUUID } from "class-validator";
import { PuchaseOptions } from "modules/premises/premises.entity";
import { BookingsStatus } from "../bookings.entity";

export class CreateBookingsDto {
	@IsUUID()
	@ApiProperty({ required: false, description: "ID of premise" })
	premise_id?: Uuid;

	@IsUUID()
	@ApiProperty({ required: false, description: "ID of client" })
	client_id?: Uuid;

	@IsUUID()
	@ApiProperty({ required: false, description: "ID of agent" })
	agent_id?: Uuid;

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
	@IsEnum(() => BookingsStatus)
	@ApiProperty({
		required: false,
		description: "Status of booking",
		enum: BookingsStatus,
	})
	status?: BookingsStatus;
}
