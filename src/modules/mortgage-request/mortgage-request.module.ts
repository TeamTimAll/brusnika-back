import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { BuildingsModule } from "../buildings/buildings.module";
import { ClientModule } from "../client/client.module";
import { PremisesModule } from "../premises/premises.module";
import { UserModule } from "../user/user.module";

import { MortgageRequestController } from "./mortgage-request.controller";
import { MortgageRequestEntity } from "./mortgage-request.entity";
import { MortgageRequestService } from "./mortgage-request.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([MortgageRequestEntity]),
		ClientModule,
		UserModule,
		PremisesModule,
		BuildingsModule,
	],
	controllers: [MortgageRequestController],
	providers: [MortgageRequestService],
	exports: [MortgageRequestService],
})
export class MortgageRequestModule {}
