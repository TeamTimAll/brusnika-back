import { IsEnum, IsString } from "class-validator";

import { BookingStatus } from "../../../bookings/bookings.entity";

export class BookingDto {
	@IsString()
	booking_ext_id!: string;

	@IsEnum(BookingStatus)
	status!: BookingStatus;
}
