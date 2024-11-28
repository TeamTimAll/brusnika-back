import { Injectable } from "@nestjs/common";

import { BuildingsService } from "../../buildings/buildings.service";
import { ProjectService } from "../../projects/projects.service";

import { BuildingDto, BuildingsDto } from "./dto";

@Injectable()
export class BuildingQueuervice {
	constructor(
		private readonly buildingService: BuildingsService,
		private readonly projectService: ProjectService,
	) {}

	async createOrUpdateBuilding(building: BuildingDto) {
		const project = await this.projectService.readOneByExtId(
			building.project_ext_id,
			{ id: true },
		);

		return this.buildingService.repository
			.createQueryBuilder()
			.insert()
			.values({
				ext_id: building.ext_id,
				name: building.name,
				address: building.address,
				number_of_floors: building.number_of_floors,
				photos: building.photos,
				project_id: project.id,
				object_id: building.object_id,
			})
			.orUpdate(
				[
					"name",
					"address",
					"number_of_floors",
					"photos",
					"project_id",
					"object_id",
				],
				["ext_id"],
			)
			.execute();
	}

	async createBuildings({ data: buildings }: BuildingsDto) {
		for await (const building of buildings) {
			await this.createOrUpdateBuilding(building);
		}
	}
}
