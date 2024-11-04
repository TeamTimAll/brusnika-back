import { Module } from "@nestjs/common";

import { BuildingsModule } from "../../buildings/buildings.module";
import { ProjectsModule } from "../../projects/projects.module";

import { BuildingQueuervice } from "./building.service";
import { BuildingQueueController } from "./building.controller";

@Module({
	imports: [BuildingsModule, ProjectsModule],
	controllers: [BuildingQueueController],
	providers: [BuildingQueuervice],
})
export class BuildingQueueModule {}
