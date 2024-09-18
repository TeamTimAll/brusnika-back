import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AnalyticsModule } from "../analytics/analytics.module";
import { BannerModule } from "../banner/banner.module";
import { UserModule } from "../user/user.module";

import { SettingsController } from "./settings.controller";
import { SettingsEntity } from "./settings.entity";
import { SettingsRepository } from "./settings.repository";
import { SettingsService } from "./settings.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([SettingsEntity]),
		UserModule,
		AnalyticsModule,
		BannerModule,
	],
	controllers: [SettingsController],
	providers: [SettingsService, SettingsRepository],
	exports: [SettingsService],
})
export class SettingsModule {}
