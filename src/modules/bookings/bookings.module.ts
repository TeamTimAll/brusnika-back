import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { BookingsController } from "./bookings.controller";
import { BookingsEntity } from "./bookings.entity";
import { BookingsService } from "./bookings.service";

@Module({
	imports: [TypeOrmModule.forFeature([BookingsEntity])],
	providers: [BookingsService],
	controllers: [BookingsController],
})
export class BookingsModule {}
