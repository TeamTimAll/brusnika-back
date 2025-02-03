import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserModule } from "../user/user.module";
import { ClientModule } from "../client/client.module";
import { LeadsModule } from "../leads/leads.module";
import { ProjectsModule } from "../projects/projects.module";
import { TaskQueueModule } from "../queues/task/task.module";
import { NotificationModule } from "../notification/notification.module";

import { TasksController } from "./tasks.controller";
import { TasksEntity } from "./tasks.entity";
import { TasksService } from "./tasks.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([TasksEntity]),
		UserModule,
		ClientModule,
		LeadsModule,
		ProjectsModule,
		forwardRef(() => TaskQueueModule),
		NotificationModule,
	],
	controllers: [TasksController],
	providers: [TasksService],
	exports: [TasksService],
})
export class TasksModule {}
