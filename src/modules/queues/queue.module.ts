import { Module } from "@nestjs/common";

import { QueueService } from "./queue.service";
import { ProjectQueueModule } from "./project/project.module";

@Module({
	providers: [QueueService],
	exports: [QueueService],
	imports: [ProjectQueueModule],
})
export class QueueModule {}
