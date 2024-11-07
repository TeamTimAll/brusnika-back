import { Module } from "@nestjs/common";

import { EventsQueueModule } from "./events_queue/events_queue.module";
import { VisitQueueModule } from "./visit_queue/visit_queue.module";
import { ProjectQueueModule } from "./project/project.module";
import { BuildingQueueModule } from "./building/building.module";
import { PremiseQueueModule } from "./premise/premise.module";
import { SectionQueueModule } from "./section/section.module";
import { ClientQueueModule } from "./client/client.module";
import { LeadQueueModule } from "./lead/lead.module";
import { UserQueueModule } from "./user/user.module";
import { BookingQueueModule } from "./booking/booking.module";

@Module({
	imports: [
		ProjectQueueModule,
		EventsQueueModule,
		VisitQueueModule,
		BuildingQueueModule,
		PremiseQueueModule,
		SectionQueueModule,
		ClientQueueModule,
		LeadQueueModule,
		UserQueueModule,
		BookingQueueModule,
	],
})
export class QueueSecuredModule {}
