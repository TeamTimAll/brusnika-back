import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEnum, IsMilitaryTime, IsOptional } from "class-validator";
import { PuchaseOptions } from "modules/premises/premises.entity";
import { BookingsStatus } from "../bookings.entity";

export class UpdateBookingsDto {
	@IsDate()
    @IsOptional()
	@ApiProperty({ required: false, description: "Date of booking" })
	date!: Date;

	@IsMilitaryTime()
    @IsOptional()
	@ApiProperty({ required: false, description: "Time of booking" })
	time!: Date;

    @IsOptional()
	@IsEnum(() => PuchaseOptions)
	@ApiProperty({
		required: false,
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
