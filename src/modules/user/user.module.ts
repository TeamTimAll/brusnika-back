import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AgenciesModule } from "../agencies/agencies.module";
import { BookingRepository } from "../bookings/booking.repository";
import { BookingsEntity } from "../bookings/bookings.entity";
import { CityModule } from "../cities/cities.module";
import { SettingsEntity } from "../settings/settings.entity";
import { SettingsRepository } from "../settings/settings.repository";
import { UserQueueModule } from "../queues/user/user.module";

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
			UserQueueModule,
		]),
		forwardRef(() => AgenciesModule),
		forwardRef(() => CityModule),
	],
	controllers: [UserController],
	providers: [UserService, BookingRepository, SettingsRepository],
	exports: [UserService, BookingRepository, SettingsRepository],
})
export class UserModule {}
