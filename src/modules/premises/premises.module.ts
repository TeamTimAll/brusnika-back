import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { BuildingsModule } from "../buildings/buildings.module";
import { SectionsModule } from "../sections/sections.module";

import { PremiseSchemaEntity } from "./premise_schema.entity";
import { PremisesController } from "./premises.controller";
import { PremiseEntity } from "./premises.entity";
import { PremisesService } from "./premises.service";
import { SeasonEntity } from "./season.entity";
import { PremiseBasketLinkEntity } from "./entities";

@Module({
	imports: [
		TypeOrmModule.forFeature([
			PremiseEntity,
			PremiseSchemaEntity,
			SeasonEntity,
			PremiseBasketLinkEntity,
		]),
		BuildingsModule,
		SectionsModule,
	],
	providers: [PremisesService],
	controllers: [PremisesController],
	exports: [PremisesService],
})
export class PremisesModule {}
