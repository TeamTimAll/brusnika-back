import { IsEnum, IsString } from "class-validator";

import { BookingStatus } from "../../../bookings/bookings.entity";

export class VisitStatusChangeDto {
	@IsString()
	visit_ext_id!: string;

	@IsEnum(BookingStatus)
	status!: BookingStatus;
}
