import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserModule } from "../../modules/user/user.module";
import { ClientModule } from "../client/client.module";
import { PremiseEntity } from "../premises/premises.entity";
import { PremisesModule } from "../premises/premises.module";
import { SettingsModule } from "../settings/settings.module";

import { BookingsController } from "./bookings.controller";
import { BookingsEntity } from "./bookings.entity";
import { BookingsService } from "./bookings.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([BookingsEntity, PremiseEntity]),
		UserModule,
		ClientModule,
		PremisesModule,
		SettingsModule,
	],
	providers: [BookingsService],
	controllers: [BookingsController],
	exports: [BookingsService],
})
export class BookingsModule {}
