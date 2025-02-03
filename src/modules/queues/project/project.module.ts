import { Module } from "@nestjs/common";

import { ProjectsModule } from "../../projects/projects.module";
import { CityModule } from "../../cities/cities.module";
import { NotificationModule } from "../../notification/notification.module";
import { UserModule } from "../../user/user.module";

import { ProjectQueueService } from "./project.service";
import { ProjectController } from "./project.controller";

@Module({
	imports: [
		ProjectsModule,
		CityModule,
		NotificationModule,
		UserModule,
	],
	controllers: [ProjectController],
	providers: [ProjectQueueService],
})
export class ProjectQueueModule {}
