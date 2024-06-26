import { Module } from "@nestjs/common";

import { BookingsModule } from "../bookings/bookings.module";
import { VisitsModule } from "../visits/visits.module";

import { CalendarController } from "./calendar.controller";
import { CalendarService } from "./calendar.service";

@Module({
	imports: [BookingsModule, VisitsModule],
	providers: [CalendarService],
	controllers: [CalendarController],
})
export class CalendarModule {}
