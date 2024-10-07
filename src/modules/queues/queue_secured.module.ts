import { Module } from "@nestjs/common";

import { BookingQueueModule } from "./booking_queue/booking_queue.module";
import { EventsQueueModule } from "./events_queue/events_queue.module";
import { QueueModule } from "./queue.module";
import { VisitQueueModule } from "./visit_queue/visit_queue.module";

@Module({
	imports: [
		QueueModule,
		EventsQueueModule,
		BookingQueueModule,
		VisitQueueModule,
	],
})
export class QueueSecuredModule {}
