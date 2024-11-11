import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";

import { BuildingsService } from "../../buildings/buildings.service";
import { ProjectService } from "../../projects/projects.service";

import { BuildingDto, BuildingsDto } from "./dto";
import { IBuilding } from "./types";

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
			})
			.orUpdate(
				["name", "address", "number_of_floors", "photos", "project_id"],
				["ext_id"],
			)
			.execute();
	}

	async createBuildings({ buildings }: BuildingsDto) {
		const preparedValues: IBuilding[] = [];

		for await (const building of buildings) {
			const project = await this.projectService.readOneByExtId(
				building.project_ext_id,
				{ id: true },
			);

			if (!project) {
				throw new NotFoundException();
			}

			preparedValues.push({
				ext_id: building.ext_id,
				name: building.name,
				address: building.address,
				number_of_floors: building.number_of_floors,
				photos: building.photos,
				project_id: project.id,
			});
		}

		if (preparedValues.length > 0) {
			return this.projectService.repository
				.createQueryBuilder()
				.insert()
				.values(preparedValues)
				.execute();
		} else {
			throw new BadRequestException("No valid project data to insert.");
		}
	}
}
