import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AnalyticsModule } from "../analytics/analytics.module";
import { UserModule } from "../user/user.module";
import { ClientModule } from "../client/client.module";
import { ProjectsModule } from "../projects/projects.module";
import { PremisesModule } from "../premises/premises.module";
import { LeadsModule } from "../leads/leads.module";

import { TasksController } from "./tasks.controller";
import { TasksEntity } from "./tasks.entity";
import { TasksService } from "./tasks.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([TasksEntity]),
		UserModule,
		AnalyticsModule,
		ClientModule,
		ProjectsModule,
		PremisesModule,
		LeadsModule,
	],
	controllers: [TasksController],
	providers: [TasksService],
	exports: [TasksService],
})
export class TasksModule {}
