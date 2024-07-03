import { Module } from "@nestjs/common";

import { BookingsModule } from "../bookings/bookings.module";
import { VisitsModule } from "../visits/visits.module";
import { EventsModule } from "../events/events.module";
import { NewsModule } from "../news/news.module";

import { CalendarController } from "./calendar.controller";
import { CalendarService } from "./calendar.service";

@Module({
	imports: [BookingsModule, VisitsModule, EventsModule, NewsModule],
	providers: [CalendarService],
	controllers: [CalendarController],
})
export class CalendarModule {}
