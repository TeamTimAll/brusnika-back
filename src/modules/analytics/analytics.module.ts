import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserModule } from "../user/user.module";
import { LeadsModule } from "../leads/leads.module";
import { NewsModule } from "../news/news.module";

import { AnalyticsController } from "./analytics.controller";
import { AnalyticsEntity } from "./analytics.entity";
import { AnalyticsService } from "./analytics.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([AnalyticsEntity]),
		UserModule,
		forwardRef(() => LeadsModule),
		forwardRef(() => NewsModule),
	],
	controllers: [AnalyticsController],
	providers: [AnalyticsService],
	exports: [AnalyticsService],
})
export class AnalyticsModule {}
