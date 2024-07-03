import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PremisesService } from "../premises/premises.service";

import { BookingsController } from "./bookings.controller";
import { BookingsEntity } from "./bookings.entity";
import { BookingsService } from "./bookings.service";

@Module({
	imports: [TypeOrmModule.forFeature([BookingsEntity])],
	providers: [BookingsService, PremisesService],
	controllers: [BookingsController],
	exports: [BookingsService],
})
export class BookingsModule {}
