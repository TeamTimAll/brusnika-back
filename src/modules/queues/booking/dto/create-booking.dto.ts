import { IsEnum, IsString } from "class-validator";

import {
	BookingStatus,
	PuchaseOptions,
} from "../../../bookings/bookings.entity";

export class BookingDto {
	@IsString()
	booking_ext_id!: string;

	@IsEnum(BookingStatus)
	status!: BookingStatus;
}

export class BookingQueueDto {
	@IsString()
	ext_id!: string | null;

	@IsString()
	premise_ext_id?: string | null;

	@IsString()
	client_ext_id?: string | null;

	@IsString()
	agent_ext_id?: string | null;

	@IsEnum(PuchaseOptions)
	purchase_option!: PuchaseOptions;

	@IsEnum(BookingStatus)
	status!: BookingStatus;
}
