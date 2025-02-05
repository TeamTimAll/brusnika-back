import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsSelect, In, Repository } from "typeorm";

import { PickBySelect } from "interfaces/pick_by_select";

import { ProjectService } from "../projects/projects.service";

import { BuildingEntity } from "./buildings.entity";
import {
	CreateBuildingDto,
	FilterBuildingDto,
	UpdateBuildingDto,
	UpdateBuildingWithIdDto,
} from "./dtos";
import { BuildingNotFoundError } from "./errors/BuildingNotFound.error";
import { IReadAllFilter } from "./types";

@Injectable()
export class BuildingsService {
	constructor(
		@InjectRepository(BuildingEntity)
		private buildingRepository: Repository<BuildingEntity>,
		@Inject(forwardRef(() => ProjectService))
		private projectService: ProjectService,
	) {}

	get repository(): Repository<BuildingEntity> {
		return this.buildingRepository;
	}

	async readAll(payload: FilterBuildingDto) {
		const { city_id, project_id } = payload;

		const whereConditions: IReadAllFilter = {};

		if (project_id) {
			whereConditions.project_id = project_id;
		}

		if (city_id) {
			whereConditions.project = { city_id: city_id };
		}

		const buildings = await this.buildingRepository.find({
			relations: { project: true },
			where: whereConditions,
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
		await this.projectService.checkExists(dto.project_id);
		return await this.buildingRepository.save(dto);
	}

	async createMany(dto: CreateBuildingDto[]) {
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

	async updateAll(dto: UpdateBuildingWithIdDto[]) {
		const foundBuilding = await this.readOneIds(dto.map((b) => b.id));
		const mergedBuildings: BuildingEntity[] = [];
		foundBuilding.forEach((b, i) => {
			mergedBuildings.push(this.buildingRepository.merge(b, dto[i]));
		});
		return await this.buildingRepository.save(mergedBuildings);
	}

	async readOneIds(ids: number[]) {
		const building = await this.buildingRepository.find({
			where: { id: In([...new Set(ids)]) },
		});

		if (!building) {
			throw new BuildingNotFoundError(`ids: ${ids.join(", ")}`);
		}

		return building;
	}

	async delete(id: number) {
		const building = await this.readOne(id);
		await this.buildingRepository.delete(building.id);
		return building;
	}

	async readOneByExtId<T extends FindOptionsSelect<BuildingEntity>>(
		ext_id: string,
		select?: T,
	): Promise<PickBySelect<BuildingEntity, T>> {
		const client = await this.buildingRepository.findOne({
			select: select,
			where: { ext_id: ext_id },
		});
		if (!client) {
			throw new BuildingNotFoundError(`ext_id: ${ext_id}`);
		}
		return client;
	}
}
