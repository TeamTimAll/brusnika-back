import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CreateBuildingDto } from "./dtos/CreateBuilding.dto";
import { UpdateBuildingDto } from "./dtos/UpdateBuilding.dto";
import { ProjectService } from "../projects/projects.service";

import { BuildingEntity } from "./buildings.entity";
import { BuildingNotFoundError } from "./errors/BuildingNotFound.error";

@Injectable()
export class BuildingsService {
	constructor(
		@InjectRepository(BuildingEntity)
		private buildingRepository: Repository<BuildingEntity>,
		private projectService: ProjectService,
	) {}

	async readAll(project_id?: number) {
		const buildings = await this.buildingRepository.find({
			relations: { project: true },
			where: {
				project_id: project_id ? project_id : undefined,
			},
		});
		return buildings;
	}

	async readOne(id: number) {
		const foundBuiling = await this.buildingRepository.findOne({
			where: {
				id: id,
			},
		});
		if (!foundBuiling) {
			throw new BuildingNotFoundError(`id: ${id}`);
		}
		return foundBuiling;
	}

	async create(dto: CreateBuildingDto) {
		await this.projectService.readOne(dto.project_id);
		return await this.buildingRepository.save(dto);
	}

	async update(id: number, dto: UpdateBuildingDto) {
		const foundBuilding = await this.readOne(id);
		const mergedBuilding = this.buildingRepository.merge(
			foundBuilding,
			dto,
		);
		return await this.buildingRepository.save(mergedBuilding);
	}

	async delete(id: number) {
		const building = await this.readOne(id);
		await this.buildingRepository.delete(building.id);
		return building;
	}
}
