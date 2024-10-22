import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ClientModule } from "../client/client.module";
import { UserModule } from "../user/user.module";

import { ExchangeRequestController } from "./exchange-request.controller";
import { ExchangeRequestEntity } from "./exchange-request.entity";
import { ExchangeRequestService } from "./exchange-request.service";
import { ExchangeRequestOpsEntity } from "./exchange-request-ops.entity";

@Module({
	imports: [
		TypeOrmModule.forFeature([
			ExchangeRequestEntity,
			ExchangeRequestOpsEntity,
		]),
		ClientModule,
		UserModule,
	],
	controllers: [ExchangeRequestController],
	providers: [ExchangeRequestService],
})
export class ExchangeRequestModule {}
