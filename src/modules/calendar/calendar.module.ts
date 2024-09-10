import { Module } from "@nestjs/common";

import { UserModule } from "../../modules/user/user.module";
import { AnalyticsModule } from "../analytics/analytics.module";
import { BookingsModule } from "../bookings/bookings.module";
import { EventsModule } from "../events/events.module";
import { NewsModule } from "../news/news.module";
import { VisitsModule } from "../visits/visits.module";

import { CalendarController } from "./calendar.controller";
import { CalendarService } from "./calendar.service";

@Module({
	imports: [
		BookingsModule,
		VisitsModule,
		EventsModule,
		NewsModule,
		UserModule,
		AnalyticsModule,
	],
	providers: [CalendarService],
	controllers: [CalendarController],
})
export class CalendarModule {}
