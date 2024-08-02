import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AgenciesController } from "./agencies.controller";
import { AgencyEntity } from "./agencies.entity";
import { AgencyService } from "./agencies.service";

@Module({
	imports: [TypeOrmModule.forFeature([AgencyEntity])],
	providers: [AgencyService],
	controllers: [AgenciesController],
	exports: [AgencyService],
})
export class AgenciesModule {}
