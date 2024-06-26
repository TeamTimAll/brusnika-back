import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AgenciesController } from "./agencies.controller";
import { AgenciesEntity } from "./agencies.entity";
import { AgenciesService } from "./agencies.service";

@Module({
	imports: [TypeOrmModule.forFeature([AgenciesEntity])],
	providers: [AgenciesService],
	controllers: [AgenciesController],
	exports: [AgenciesService],
})
export class AgenciesModule {}
