import { Module } from "@nestjs/common";

import { LeadsModule } from "../../leads/leads.module";

import { LeadOpsQueueService } from "./lead-ops.service";
import { LeadOpsQueueController } from "./lead-ops.controller";

@Module({
	imports: [LeadsModule],
	controllers: [LeadOpsQueueController],
	providers: [LeadOpsQueueService],
})
export class LeadOpsQueueModule {}
