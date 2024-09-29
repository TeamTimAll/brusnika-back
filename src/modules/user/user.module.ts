import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AgenciesModule } from "../agencies/agencies.module";
import { AnalyticsModule } from "../analytics/analytics.module";
import { BookingRepository } from "../bookings/booking.repository";
import { BookingsEntity } from "../bookings/bookings.entity";
import { CityModule } from "../cities/cities.module";
import { SettingsEntity } from "../settings/settings.entity";
import { SettingsRepository } from "../settings/settings.repository";

import { UserController } from "./user.controller";
import { UserEntity } from "./user.entity";
import { UserService } from "./user.service";
import { UserActivityEntity } from "./entities/user-activity.entity";

@Module({
	imports: [
		TypeOrmModule.forFeature([
			UserEntity,
			BookingsEntity,
			SettingsEntity,
			UserActivityEntity,
		]),
		forwardRef(() => AgenciesModule),
		forwardRef(() => CityModule),
		forwardRef(() => AnalyticsModule),
	],
	controllers: [UserController],
	providers: [UserService, BookingRepository, SettingsRepository],
	exports: [UserService, BookingRepository, SettingsRepository],
})
export class UserModule {}
