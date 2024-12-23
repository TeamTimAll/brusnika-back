import { Inject, Injectable } from "@nestjs/common";

import { UpdateSettingsDto } from "./dto/UpdateSettings.dto";
import { SettingsNotFoundError } from "./errors/SettingsNotFound.error";
import { SettingsEntity } from "./settings.entity";
import { SettingsRepository } from "./settings.repository";

@Injectable()
export class SettingsService {
	constructor(
		@Inject()
		private readonly settingsRepository: SettingsRepository,
	) {}

	async read(): Promise<SettingsEntity> {
		const settings = await this.settingsRepository.readOne();
		if (!settings) {
			throw new SettingsNotFoundError();
		}
		return settings;
	}

	async update(dto: UpdateSettingsDto) {
		const settings = await this.read();
		return await this.settingsRepository.update({id: settings.id, dto});
	}
}
