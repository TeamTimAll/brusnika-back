import { Module } from "@nestjs/common";

import { BuildingsModule } from "../../buildings/buildings.module";
import { SectionsModule } from "../../sections/sections.module";

import { SectionQueueService } from "./section.service";
import { SectionQueueController } from "./section.controller";

@Module({
	imports: [BuildingsModule, SectionsModule],
	controllers: [SectionQueueController],
	providers: [SectionQueueService],
})
export class PremiseQueueModule {}
