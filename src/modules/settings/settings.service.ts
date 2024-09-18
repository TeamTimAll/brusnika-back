import { Inject, Injectable } from "@nestjs/common";

import { BannerService } from "../banner/banner.service";

import { UpdateSettingsDto } from "./dto/UpdateSettings.dto";
import { SettingsNotFoundError } from "./errors/SettingsNotFound.error";
import { SettingsEntity } from "./settings.entity";
import { SettingsRepository } from "./settings.repository";

@Injectable()
export class SettingsService {
	constructor(
		@Inject()
		private readonly settingsRepository: SettingsRepository,
		private readonly bannerService: BannerService,
	) {}

	async read(): Promise<SettingsEntity> {
		const settings = await this.settingsRepository.readOne();
		if (!settings) {
			throw new SettingsNotFoundError();
		}
		const banner = await this.bannerService.readAllForSettings();
		settings.banner = banner;
		return settings;
	}

	async update(dto: UpdateSettingsDto) {
		const settings = await this.read();
		const mergedSettings = this.settingsRepository.merge(settings, dto);
		return await this.settingsRepository.save(mergedSettings);
	}
}
