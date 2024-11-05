import { Module } from "@nestjs/common";

import { BuildingsModule } from "../../buildings/buildings.module";
import { SectionsModule } from "../../sections/sections.module";
import { PremisesModule } from "../../premises/premises.module";

import { PremiseQueueService } from "./premise.service";
import { PremiseQueueController } from "./premise.controller";

@Module({
	imports: [PremisesModule, BuildingsModule, SectionsModule],
	controllers: [PremiseQueueController],
	providers: [PremiseQueueService],
})
export class PremiseQueueModule {}
