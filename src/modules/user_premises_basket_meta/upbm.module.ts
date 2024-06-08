import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserPremisesBasketEntity } from "../user_premises_basket/upb.entity";

import { UPBController } from "./upbm.controller";
import { UserPremisesBasketMetaEntity } from "./upbm.entity";
import { UPBMService } from "./upbm.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([
			UserPremisesBasketEntity,
			UserPremisesBasketMetaEntity,
		]),
	],
	controllers: [UPBController],
	exports: [UPBMService],
	providers: [UPBMService],
})
export class UPBMModule {}
