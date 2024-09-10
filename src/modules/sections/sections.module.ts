import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AnalyticsModule } from "../analytics/analytics.module";
import { BuildingsModule } from "../buildings/buildings.module";

import { SectionsController } from "./sections.controller";
import { SectionEntity } from "./sections.entity";
import { SectionsService } from "./sections.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([SectionEntity]),
		BuildingsModule,
		AnalyticsModule,
	],
	providers: [SectionsService],
	controllers: [SectionsController],
	exports: [SectionsService],
})
export class SectionsModule {}
