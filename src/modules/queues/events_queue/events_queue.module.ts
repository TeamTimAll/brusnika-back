import { Module } from "@nestjs/common";

import { AgenciesModule } from "../../agencies/agencies.module";
import { BookingsModule } from "../../bookings/bookings.module";
import { BuildingsModule } from "../../buildings/buildings.module";
import { CityModule } from "../../cities/cities.module";
import { ClientModule } from "../../client/client.module";
import { LeadsModule } from "../../leads/leads.module";
import { PremisesModule } from "../../premises/premises.module";
import { ProjectsModule } from "../../projects/projects.module";
import { SectionsModule } from "../../sections/sections.module";
import { UserModule } from "../../user/user.module";
import { VisitsModule } from "../../visits/visits.module";

import { EventsQueueController } from "./events_queue.controller";
import { EventsQueueService } from "./events_queue.service";

@Module({
	imports: [
		ClientModule,
		UserModule,
		ProjectsModule,
		PremisesModule,
		BuildingsModule,
		SectionsModule,
		CityModule,
		LeadsModule,
		AgenciesModule,
		BookingsModule,
		VisitsModule,
	],
	controllers: [EventsQueueController],
	providers: [EventsQueueService],
})
export class EventsQueueModule {}
