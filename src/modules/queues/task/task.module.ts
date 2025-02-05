import { forwardRef, Module } from "@nestjs/common";

import { ClientModule } from "../../client/client.module";
import { UserModule } from "../../user/user.module";
import { QueueModule } from "../queue.module";
import { TasksModule } from "../../tasks/tasks.module";
import { ProjectsModule } from "../../projects/projects.module";
import { LeadsModule } from "../../leads/leads.module";
import { NotificationModule } from "../../notification/notification.module";

import { TaskQueueService } from "./task.service";
import { TaskQueueController } from "./task.controller";

@Module({
	imports: [
		forwardRef(() => TasksModule),
		UserModule,
		ClientModule,
		ProjectsModule,
		QueueModule,
		LeadsModule,
		NotificationModule,
	],
	controllers: [TaskQueueController],
	providers: [TaskQueueService],
	exports: [TaskQueueService],
})
export class TaskQueueModule {}
