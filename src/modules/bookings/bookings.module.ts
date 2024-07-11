import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PremisesService } from "../premises/premises.service";

import { UserModule } from "../../modules/user/user.module";
import { BookingsController } from "./bookings.controller";
import { BookingsEntity } from "./bookings.entity";
import { BookingsService } from "./bookings.service";

@Module({
	imports: [TypeOrmModule.forFeature([BookingsEntity]), UserModule],
	providers: [BookingsService, PremisesService],
	controllers: [BookingsController],
	exports: [BookingsService],
})
export class BookingsModule {}
