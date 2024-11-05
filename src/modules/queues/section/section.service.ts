import { Injectable } from "@nestjs/common";

import { BuildingsService } from "../../buildings/buildings.service";
import { SectionsService } from "../../sections/sections.service";
import { BuildingEntity } from "../../buildings/buildings.entity";

import { SectionDto } from "./dto";

@Injectable()
export class SectionQueueService {
	constructor(
		private readonly buildingService: BuildingsService,
		private readonly sectionService: SectionsService,
	) {}

	async createOrUpdateSection(section: SectionDto) {
		let building: Pick<BuildingEntity, "id"> | undefined;

		if (section.building_ext_id) {
			building = await this.buildingService.readOneByExtId(
				section.building_ext_id,
				{ id: true },
			);
		}

		return this.sectionService.repostory
			.createQueryBuilder()
			.insert()
			.values({
				ext_id: section.ext_id,
				name: section.name,
				number_of_floors: section.number_of_floors,
				building_id: building?.id,
			})
			.orUpdate(["name", "building_id", "number_of_floors"], ["ext_id"])
			.execute();
	}
}
