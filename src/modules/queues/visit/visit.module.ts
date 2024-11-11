import { Module } from "@nestjs/common";

import { ClientModule } from "../../client/client.module";
import { ProjectsModule } from "../../projects/projects.module";
import { UserModule } from "../../user/user.module";
import { QueueModule } from "../queue.module";

import { VisitQueueService } from "./visit.service";

@Module({
	imports: [QueueModule, UserModule, ClientModule, ProjectsModule],
	providers: [VisitQueueService],
	exports: [VisitQueueService],
})
export class VisitQueueModule {}
