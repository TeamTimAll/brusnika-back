import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ClientModule } from "../client/client.module";
import { UserModule } from "../user/user.module";

import { CallRequestController } from "./call-request.controller";
import { CallRequestEntity } from "./call-request.entity";
import { CallRequestService } from "./call-request.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([CallRequestEntity]),
		ClientModule,
		UserModule,
	],
	controllers: [CallRequestController],
	providers: [CallRequestService],
})
export class CallRequestModule {}
