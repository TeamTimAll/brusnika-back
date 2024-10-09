import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AgenciesModule } from "../agencies/agencies.module";
import { AnalyticsModule } from "../analytics/analytics.module";
import { BuildingsModule } from "../buildings/buildings.module";
import { ClientModule } from "../client/client.module";
import { PremisesModule } from "../premises/premises.module";
import { ProjectsModule } from "../projects/projects.module";
import { UserModule } from "../user/user.module";
import { NotificationModule } from "../notification/notification.module";

import { LeadOpsEntity } from "./lead_ops.entity";
import { LeadsController } from "./leads.controller";
import { LeadsEntity } from "./leads.entity";
import { LeadsService } from "./leads.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([LeadsEntity, LeadOpsEntity]),
		ClientModule,
		UserModule,
		ProjectsModule,
		PremisesModule,
		BuildingsModule,
		AgenciesModule,
		forwardRef(() => AnalyticsModule),
		NotificationModule,
	],
	controllers: [LeadsController],
	providers: [LeadsService],
	exports: [LeadsService],
})
export class LeadsModule {}
