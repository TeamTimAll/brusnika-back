import { Module } from "@nestjs/common";

import { ClientModule } from "../../client/client.module";
import { UserModule } from "../../user/user.module";
import { PremisesModule } from "../../premises/premises.module";
import { LeadsModule } from "../../leads/leads.module";
import { ProjectsModule } from "../../projects/projects.module";

import { LeadQueueService } from "./lead.service";
import { LeadQueueController } from "./lead.controller";

@Module({
	imports: [
		ClientModule,
		UserModule,
		ProjectsModule,
		PremisesModule,
		LeadsModule,
	],
	controllers: [LeadQueueController],
	providers: [LeadQueueService],
})
export class LeadQueueModule {}
