import { Module } from "@nestjs/common";

import { UserModule } from "../../user/user.module";
import { AgenciesModule } from "../../agencies/agencies.module";
import { CityModule } from "../../cities/cities.module";

import { UserQueueService } from "./user.service";
import { UserQueueController } from "./user.controller";

@Module({
	imports: [UserModule, AgenciesModule, CityModule],
	controllers: [UserQueueController],
	providers: [UserQueueService],
})
export class UserQueueModule {}
