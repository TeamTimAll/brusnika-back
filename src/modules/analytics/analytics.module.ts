import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserModule } from "../user/user.module";

import { AnalyticsController } from "./analytics.controller";
import { AnalyticsEntity } from "./analytics.entity";
import { AnalyticsService } from "./analytics.service";

@Module({
	imports: [TypeOrmModule.forFeature([AnalyticsEntity]), UserModule],
	controllers: [AnalyticsController],
	providers: [AnalyticsService],
	exports: [AnalyticsService],
})
export class AnalyticsModule {}
