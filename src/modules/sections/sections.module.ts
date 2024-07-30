import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { BuildingsModule } from "../buildings/buildings.module";

import { SectionsController } from "./sections.controller";
import { SectionsEntity } from "./sections.entity";
import { SectionsService } from "./sections.service";

@Module({
	imports: [TypeOrmModule.forFeature([SectionsEntity]), BuildingsModule],
	providers: [SectionsService],
	controllers: [SectionsController],
	exports: [SectionsService],
})
export class SectionsModule {}
