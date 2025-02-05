import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserModule } from "../user/user.module";

import { SettingsController } from "./settings.controller";
import { SettingsEntity } from "./settings.entity";
import { SettingsRepository } from "./settings.repository";
import { SettingsService } from "./settings.service";

@Module({
	imports: [TypeOrmModule.forFeature([SettingsEntity]), UserModule],
	controllers: [SettingsController],
	providers: [SettingsService, SettingsRepository],
	exports: [SettingsService],
})
export class SettingsModule {}
