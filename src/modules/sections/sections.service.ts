import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsSelect, Repository } from "typeorm";

import { PickBySelect } from "interfaces/pick_by_select";

import { BuildingsService } from "../buildings/buildings.service";

import { CreateSectionsDto } from "./dtos/CreateSections.dto";
import { UpdateSectionsDto } from "./dtos/UpdateSections.dto";
import { SectionNotFoundError } from "./errors/SectionNotFound.error";
import { SectionEntity } from "./sections.entity";

@Injectable()
export class SectionsService {
	constructor(
		@InjectRepository(SectionEntity)
		private sectionsRepository: Repository<SectionEntity>,
		@Inject()
		private buildingService: BuildingsService,
	) {}

	get repostory(): Repository<SectionEntity> {
		return this.sectionsRepository;
	}

	async create(dto: CreateSectionsDto) {
		const section = this.sectionsRepository.create(dto);
		if (typeof dto.building_id !== "undefined") {
			await this.buildingService.readOne(dto.building_id);
		}
		return await this.sectionsRepository.save(section);
	}

	async readOne(id: number) {
		const foundSection = await this.sectionsRepository.findOne({
			where: {
				id: id,
			},
		});
		if (!foundSection) {
			throw new SectionNotFoundError(`id: ${id}`);
		}
		return foundSection;
	}

	async readAll(building_id: number) {
		await this.buildingService.readOne(building_id);
		const sections = this.sectionsRepository.find({
			where: {
				building_id: building_id,
			},
		});
		return sections;
	}

	async update(id: number, dto: UpdateSectionsDto) {
		const foundSection = await this.readOne(id);
		if (typeof dto.building_id !== "undefined") {
			await this.buildingService.readOne(dto.building_id);
		}
		const mergedSection = this.sectionsRepository.merge(foundSection, dto);
		return await this.sectionsRepository.save(mergedSection);
	}

	async delete(id: number) {
		const foundSection = await this.readOne(id);
		await this.sectionsRepository.delete(foundSection.id);
		return foundSection;
	}

	async readOneByExtId<T extends FindOptionsSelect<SectionEntity>>(
		ext_id: string,
		select?: T,
	): Promise<PickBySelect<SectionEntity, T>> {
		const client = await this.sectionsRepository.findOne({
			select: select,
			where: { ext_id: ext_id },
		});
		if (!client) {
			throw new SectionNotFoundError(`ext_id: ${ext_id}`);
		}
		return client;
	}
}
