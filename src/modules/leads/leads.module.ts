import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AgenciesEntity } from "../agencies/agencies.entity";
import { AgenciesService } from "../agencies/agencies.service";
import { BuildingsEntity } from "../buildings/buildings.entity";
import { BuildingsService } from "../buildings/buildings.service";
import { ClientStatusEntity } from "../client-status/client-status.entity";
import { ClientStatusService } from "../client-status/client-status.service";
import { ClientEntity } from "../client/client.entity";
import { ClientService } from "../client/client.service";
import { PremisesEntity } from "../premises/premises.entity";
import { PremisesService } from "../premises/premises.service";
import { ProjectEntity } from "../projects/project.entity";
import { ProjectsService } from "../projects/projects.service";
import { UserEntity } from "../user/user.entity";
import { UserService } from "../user/user.service";

import { LeadOpsEntity } from "./lead_ops.entity";
import { LeadsController } from "./leads.controller";
import { LeadsEntity } from "./leads.entity";
import { LeadsService } from "./leads.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([
			LeadsEntity,
			LeadOpsEntity,
			ClientEntity,
			ClientStatusEntity,
			ProjectEntity,
			PremisesEntity,
			BuildingsEntity,
			AgenciesEntity,
			UserEntity,
		]),
	],
	controllers: [LeadsController],
	providers: [
		LeadsService,
		UserService,
		AgenciesService,
		BuildingsService,
		ClientService,
		ClientStatusService,
		ProjectsService,
		PremisesService,
	],
})
export class LeadsModule {}
