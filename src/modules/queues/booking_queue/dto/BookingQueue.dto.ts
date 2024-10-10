import { IsEnum, IsString } from "class-validator";

import {
	BookingStatus,
	PuchaseOptions,
} from "../../../bookings/bookings.entity";

export class BookingQueueDto {
	@IsString()
	ext_id!: string | null;

	@IsString()
	premise_ext_id?: string | null;

	@IsString()
	client_ext_id?: string | null;

	@IsString()
	agent_ext_id?: string | null;

	// @IsDateString()
	// date!: Date;

	// @IsMilitaryTime()
	// time!: string;

	@IsEnum(PuchaseOptions)
	purchase_option!: PuchaseOptions;

	@IsEnum(BookingStatus)
	status!: BookingStatus;
}
