import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserPremisesBasketMetaEntity } from "../user_premises_basket_meta/upbm.entity";

import { UPBController } from "./upb.controller";
import { UserPremisesBasketEntity } from "./upb.entity";
import { UPBService } from "./upb.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([
			UserPremisesBasketEntity,
			UserPremisesBasketMetaEntity,
		]),
	],
	controllers: [UPBController],
	exports: [UPBService],
	providers: [UPBService],
})
export class UPBModule {}
