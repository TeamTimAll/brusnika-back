import { Module } from "@nestjs/common";

import { AgenciesModule } from "../../agencies/agencies.module";
import { CityModule } from "../../cities/cities.module";

import { AgencyQueueService } from "./agency.service";
import { AgencyQueueController } from "./agency.controller";

@Module({
	imports: [CityModule, AgenciesModule],
	controllers: [AgencyQueueController],
	providers: [AgencyQueueService],
})
export class LeadQueueModule {}
