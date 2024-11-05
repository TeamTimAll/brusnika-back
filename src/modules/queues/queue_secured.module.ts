import { Module } from "@nestjs/common";

import { BookingQueueModule } from "./booking_queue/booking_queue.module";
import { EventsQueueModule } from "./events_queue/events_queue.module";
import { VisitQueueModule } from "./visit_queue/visit_queue.module";
import { ProjectQueueModule } from "./project/project.module";
import { BuildingQueueModule } from "./building/building.module";
import { PremiseQueueModule } from "./premise/premise.module";
import { SectionQueueModule } from "./section/section.module";

@Module({
	imports: [
		ProjectQueueModule,
		EventsQueueModule,
		BookingQueueModule,
		VisitQueueModule,
		BuildingQueueModule,
		PremiseQueueModule,
		SectionQueueModule,
	],
})
export class QueueSecuredModule {}
