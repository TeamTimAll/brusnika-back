import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";

import { SettingsEntity } from "./settings.entity";

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

	merge(
		mergeIntoEntity: SettingsEntity,
		...entityLikes: DeepPartial<SettingsEntity>[]
	): SettingsEntity {
		return this.repository.merge(mergeIntoEntity, ...entityLikes);
	}

	save(entity: SettingsEntity) {
		return this.repository.save(entity);
	}
}
