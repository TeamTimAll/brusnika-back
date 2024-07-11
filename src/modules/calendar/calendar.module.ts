import { Module } from "@nestjs/common";

import { BookingsModule } from "../bookings/bookings.module";
import { EventsModule } from "../events/events.module";
import { NewsModule } from "../news/news.module";
import { VisitsModule } from "../visits/visits.module";

import { UserModule } from "../../modules/user/user.module";
import { CalendarController } from "./calendar.controller";
import { CalendarService } from "./calendar.service";

@Module({
	imports: [
		BookingsModule,
		VisitsModule,
		EventsModule,
		NewsModule,
		UserModule,
	],
	providers: [CalendarService],
	controllers: [CalendarController],
})
export class CalendarModule {}
