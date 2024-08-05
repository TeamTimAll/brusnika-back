import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { BuildingsModule } from "../buildings/buildings.module";
import { SectionsModule } from "../sections/sections.module";

import { PremisesController } from "./premises.controller";
import { PremisesEntity } from "./premises.entity";
import { PremisesService } from "./premises.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([PremisesEntity]),
		BuildingsModule,
		SectionsModule,
	],
	providers: [PremisesService],
	controllers: [PremisesController],
	exports: [PremisesService],
})
export class PremisesModule {}
