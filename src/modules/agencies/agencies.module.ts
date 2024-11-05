import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CityModule } from "../cities/cities.module";
import { UserModule } from "../user/user.module";

import { AgencyController } from "./agencies.controller";
import { AgencyEntity } from "./agencies.entity";
import { AgencyService } from "./agencies.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([AgencyEntity]),
		CityModule,
		forwardRef(() => UserModule),
	],
	providers: [AgencyService],
	controllers: [AgencyController],
	exports: [AgencyService],
})
export class AgenciesModule {}
