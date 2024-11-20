import { Module } from "@nestjs/common";

import { UserModule } from "../../user/user.module";
import { AgenciesModule } from "../../agencies/agencies.module";
import { CityModule } from "../../cities/cities.module";
import { QueueModule } from "../queue.module";

import { UserQueueService } from "./user.service";
import { UserQueueController } from "./user.controller";

@Module({
	imports: [UserModule, AgenciesModule, CityModule, QueueModule],
	controllers: [UserQueueController],
	providers: [UserQueueService],
	exports: [UserQueueService],
})
export class UserQueueModule {}
