import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { SettingsEntity } from "./settings.entity";
import { UpdateSettingsDto } from "./dto/UpdateSettings.dto";

@Injectable()
export class SettingsRepository {
	constructor(
		@InjectRepository(SettingsEntity)
		private readonly repository: Repository<SettingsEntity>,
	) {}

	async readOne(): Promise<SettingsEntity | null> {
		const [settings] = await this.repository.find();
		return settings;
	}

	async update(params: {id: number, dto: UpdateSettingsDto})
	{
		return await this.repository.save({
			id: params.id,
			...params.dto
		})
	}
}
