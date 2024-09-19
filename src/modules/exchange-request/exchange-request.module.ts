import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ClientModule } from "../client/client.module";
import { UserModule } from "../user/user.module";
import { AnalyticsModule } from "../analytics/analytics.module";

import { ExchangeRequestController } from "./exchange-request.controller";
import { ExchangeRequestEntity } from "./exchange-request.entity";
import { ExchangeRequestService } from "./exchange-request.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([ExchangeRequestEntity]),
		ClientModule,
		UserModule,
		AnalyticsModule,
	],
	controllers: [ExchangeRequestController],
	providers: [ExchangeRequestService],
})
export class ExchangeRequestModule {}
