import { forwardRef, Module } from "@nestjs/common";

import { ClientModule } from "../../client/client.module";
import { ProjectsModule } from "../../projects/projects.module";
import { UserModule } from "../../user/user.module";
import { QueueModule } from "../queue.module";
import { VisitsModule } from "../../visits/visits.module";
import { NotificationModule } from "../../notification/notification.module";

import { VisitQueueService } from "./visit.service";
import { VisitQueueController } from "./visit.controller";

@Module({
	imports: [
		QueueModule,
		UserModule,
		ClientModule,
		ProjectsModule,
		forwardRef(() => VisitsModule),
		NotificationModule,
	],
	controllers: [VisitQueueController],
	providers: [VisitQueueService],
	exports: [VisitQueueService],
})
export class VisitQueueModule {}
