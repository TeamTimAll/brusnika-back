import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { BuildingsModule } from "../buildings/buildings.module";
import { SectionsModule } from "../sections/sections.module";

import { PremisesController } from "./premises.controller";
import { PremiseEntity } from "./premises.entity";
import { PremisesService } from "./premises.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([PremiseEntity]),
		BuildingsModule,
		SectionsModule,
	],
	providers: [PremisesService],
	controllers: [PremisesController],
	exports: [PremisesService],
})
export class PremisesModule {}
