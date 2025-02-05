import { Module } from "@nestjs/common";

import { VisitQueueModule } from "./visit/visit.module";
import { ProjectQueueModule } from "./project/project.module";
import { BuildingQueueModule } from "./building/building.module";
import { PremiseQueueModule } from "./premise/premise.module";
import { SectionQueueModule } from "./section/section.module";
import { ClientQueueModule } from "./client/client.module";
import { LeadQueueModule } from "./lead/lead.module";
import { UserQueueModule } from "./user/user.module";
import { BookingQueueModule } from "./booking/booking.module";
import { TaskQueueModule } from "./task/task.module";
import { AgenciesQueueModule } from "./agency/agency.module";
import { LeadOpsQueueModule } from "./lead-ops/lead-ops.module";

@Module({
	imports: [
		ProjectQueueModule,
		VisitQueueModule,
		BuildingQueueModule,
		PremiseQueueModule,
		SectionQueueModule,
		ClientQueueModule,
		LeadQueueModule,
		UserQueueModule,
		BookingQueueModule,
		TaskQueueModule,
		AgenciesQueueModule,
		LeadOpsQueueModule,
	],
})
export class QueueSecuredModule {}
