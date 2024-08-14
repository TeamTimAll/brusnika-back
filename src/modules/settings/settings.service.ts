import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { UpdateSettingsDto } from "./dto/UpdateSettings.dto";
import { SettingsNotFoundError } from "./errors/SettingsNotFound.error";
import { SettingsEntity } from "./settings.entity";

@Injectable()
export class SettingsService {
	constructor(
		@InjectRepository(SettingsEntity)
		private readonly settingsRepository: Repository<SettingsEntity>,
	) {}

	async read(): Promise<SettingsEntity> {
		const [settings] = await this.settingsRepository.find();
		if (!settings) {
			throw new SettingsNotFoundError();
		}
		return settings;
	}

	async update(dto: UpdateSettingsDto) {
		const settings = await this.read();
		const mergedSettings = this.settingsRepository.merge(settings, dto);
		return await this.settingsRepository.save(mergedSettings);
	}
}
