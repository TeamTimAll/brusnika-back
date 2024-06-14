import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PremisesBasketMetaEntity } from "../premises_basket_meta/premises_basket_meta.entity";

import { PremisesBasketController } from "./premises_basket.controller";
import { PremisesBasketEntity } from "./premises_basket.entity";
import { PremisesBasketService } from "./premises_basket.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([
			PremisesBasketEntity,
			PremisesBasketMetaEntity,
		]),
	],
	controllers: [PremisesBasketController],
	exports: [PremisesBasketService],
	providers: [PremisesBasketService],
})
export class PremisesBasketModule {}
