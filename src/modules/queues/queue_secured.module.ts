import { Module } from "@nestjs/common";

import { BookingQueueModule } from "./booking_queue/booking_queue.module";
import { EventsQueueModule } from "./events_queue/events_queue.module";
import { VisitQueueModule } from "./visit_queue/visit_queue.module";
import { ProjectQueueModule } from "./project/project.module";
import { BuildingQueueModule } from "./building/building.module";
import { PremiseQueueModule } from "./premise/premise.module";
import { SectionQueueModule } from "./section/section.module";
import { ClientQueueModule } from "./client/client.module";
import { LeadQueueModule } from "./lead/lead.module";
import { UserQueueModule } from "./user/user.module";

@Module({
	imports: [
		ProjectQueueModule,
		EventsQueueModule,
		BookingQueueModule,
		VisitQueueModule,
		BuildingQueueModule,
		PremiseQueueModule,
		SectionQueueModule,
		ClientQueueModule,
		LeadQueueModule,
		UserQueueModule,
	],
})
export class QueueSecuredModule {}
