import { forwardRef, Module } from "@nestjs/common";

import { AgenciesModule } from "../../agencies/agencies.module";
import { CityModule } from "../../cities/cities.module";
import { QueueModule } from "../queue.module";
import { UserModule } from "../../user/user.module";

import { AgencyQueueService } from "./agency.service";
import { AgencyQueueController } from "./agency.controller";

@Module({
	imports: [
		CityModule,
		forwardRef(() => AgenciesModule),
		QueueModule,
		forwardRef(() => UserModule),
	],
	controllers: [AgencyQueueController],
	providers: [AgencyQueueService],
	exports: [AgencyQueueService],
})
export class AgenciesQueueModule {}
