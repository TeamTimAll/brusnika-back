import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PremisesBasketEntity } from "../premises_basket/premises_basket.entity";

import { PremisesBasketMetaController } from "./premises_basket_meta.controller";
import { PremisesBasketMetaEntity } from "./premises_basket_meta.entity";
import { PremisesBasketMetaService } from "./premises_basket_meta.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([
			PremisesBasketEntity,
			PremisesBasketMetaEntity,
		]),
	],
	controllers: [PremisesBasketMetaController],
	exports: [PremisesBasketMetaService],
	providers: [PremisesBasketMetaService],
})
export class PremisesBasketMetaModule {}
