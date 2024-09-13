import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AnalyticsModule } from "../analytics/analytics.module";
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
		forwardRef(() => AnalyticsModule),
	],
	providers: [AgencyService],
	controllers: [AgencyController],
	exports: [AgencyService],
})
export class AgenciesModule {}
