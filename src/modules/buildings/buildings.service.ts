import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";

import { Uuid } from "boilerplate.polyfill";

import { BasicService } from "../../generic/service";
import { ProjectNotFoundError } from "../../modules/projects/errors/ProjectNotFound.error";
import { ProjectEntity } from "../../modules/projects/project.entity";
import { CreateBuilding } from "../buildings/dtos/building.create.dto";
import { UpdateBuilding } from "../buildings/dtos/building.update.dto";

import { BuildingsEntity } from "./buildings.entity";
import { BuildingNotFoundError } from "./errors/BuildingNotFound.error";

export class BuildingsService extends BasicService<
	BuildingsEntity,
	CreateBuilding,
	UpdateBuilding
> {
	constructor(
		@InjectDataSource() dataSource: DataSource,
		@InjectRepository(ProjectEntity)
		private projectsRepository: Repository<ProjectEntity>,
	) {
		super("buildings", BuildingsEntity, dataSource);
	}

	async findAllBuilding(project_id?: Uuid) {
		let buildings: BuildingsEntity[];
		if (project_id && project_id.length) {
			buildings = await this.r_findAll({
				where: { project_id },
				relations: ["project"],
			});
		} else {
			buildings = await this.r_findAll({
				relations: ["project"],
			});
		}
		if (!buildings.length) {
			throw new BuildingNotFoundError("buildings not found");
		}
		return buildings;
	}

	async createBuilding(dto: CreateBuilding) {
		const foundProject = await this.projectsRepository.find({
			where: { id: dto.project_id },
		});

		if (!foundProject.length) {
			throw new ProjectNotFoundError(
				`'${dto.project_id}' project not found`,
			);
		}

		const newBuildings = await this.repository.save(dto);
		return newBuildings;
	}

	async updateBuilding(id: Uuid, dto: UpdateBuilding) {
		const foundBuilding = await this.repository.find({ where: { id } });

		if (!foundBuilding.length) {
			throw new BuildingNotFoundError(`'${id}' building not found`);
		}
		let updatedBuilding = this.repository.merge(foundBuilding[0], dto);

		updatedBuilding = await this.repository.save(updatedBuilding);

		return updatedBuilding;
	}

	async delete(id: Uuid) {
		const building = await this.repository.findOne({
			where: { id },
		});

		if (!building) {
			throw new BuildingNotFoundError(`'${id}' building not found`);
		}

		await this.repository.remove(building);
		return building;
	}
}
