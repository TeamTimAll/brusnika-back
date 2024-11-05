import { Module } from "@nestjs/common";

import { ProjectsModule } from "../../projects/projects.module";
import { CityModule } from "../../cities/cities.module";

import { ProjectQueueService } from "./project.service";
import { ProjectController } from "./project.controller";

@Module({
	imports: [ProjectsModule, CityModule],
	controllers: [ProjectController],
	providers: [ProjectQueueService],
})
export class ProjectQueueModule {}
