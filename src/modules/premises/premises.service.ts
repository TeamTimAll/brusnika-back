import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

import { Uuid } from "boilerplate.polyfill";

import { BasicService } from "../../generic/service";

import { CreatePremisesDto } from "./dtos/create-premises.dto";
import { PremisesFilterDto } from "./dtos/premises.dto";
import { UpdatePremisesDto } from "./dtos/update-premises.dto";
import { PremisesEntity } from "./premises.entity";

export class PremisesService extends BasicService<
	PremisesEntity,
	CreatePremisesDto,
	UpdatePremisesDto
> {
	constructor(@InjectDataSource() dataSource: DataSource) {
		super("premises", PremisesEntity, dataSource);
	}

	async getMultiplePremisesByIds(ids: Uuid[]) {
		let query = this.repository.createQueryBuilder("premise");
		for (let i = 0; i < ids.length; i++) {
			query = query.orWhere(`premise.id = :id_${i}`, {
				[`id_${i}`]: ids[i],
			});
		}
		const premises = await query.getMany();

		return premises;
	}

	async getPremisesFiltered(
		filter?: PremisesFilterDto,
	): Promise<PremisesEntity[]> {
		let query = this.repository
			.createQueryBuilder("premise")
			.leftJoinAndSelect("premise.building", "building")
			.leftJoinAndSelect("premise.section", "section")
			.leftJoinAndSelect("building.project", "project");
		if (filter) {
			if (filter.endYear) {
				query = query.andWhere("project.end_date = :endYear", {
					endYear: filter.endYear,
				});
			}

			if (filter.type) {
				query = query.andWhere("premise.type = :type", {
					type: filter.type,
				});
			}

			if (filter.rooms) {
				query = query.andWhere("premise.rooms = :rooms", {
					rooms: filter.rooms,
				});
			}

			if (filter.project_id) {
				query = query.andWhere("building.project_id = :project_id", {
					project_id: filter.project_id,
				});
			}

			if (filter.building_id) {
				query = query.andWhere("premise.building_id = :building_id", {
					building_id: filter.building_id,
				});
			}

			if (filter.building_id) {
				query = query.andWhere("premise.building_id = :building_id", {
					building_id: filter.building_id,
				});
			}

			if (filter.min_size) {
				query = query.andWhere("premise.size >= :min_size", {
					min_size: parseInt(filter.min_size),
				});
			}

			if (filter.max_size) {
				query = query.andWhere("premise.size <= :max_size", {
					max_size: parseInt(filter.max_size),
				});
			}

			if (filter.min_floor) {
				query = query.andWhere("premise.floor >= :min_floor", {
					min_floor: filter.min_floor,
				});
			}

			if (filter.max_floor) {
				query = query.andWhere("premise.floor <= :max_floor", {
					max_floor: filter.max_floor,
				});
			}

			if (filter.min_number) {
				query = query.andWhere("premise.number >= :min_number", {
					min_number: filter.min_number,
				});
			}

			if (filter.max_number) {
				query = query.andWhere("premise.number <= :max_number", {
					max_number: filter.max_number,
				});
			}

			if (filter.min_price) {
				query = query.andWhere("premise.price >= :min_price", {
					min_price: filter.min_price,
				});
			}

			if (filter.max_price) {
				query = query.andWhere("premise.price <= :max_price", {
					max_price: filter.max_price,
				});
			}

			if (filter.status) {
				query = query.andWhere("premise.status = :status", {
					status: filter.status,
				});
			}

			if (filter.section_id) {
				query = query.andWhere("premise.section_id = :section_id", {
					section_id: filter.section_id,
				});
			}
		}

		const premises = await query.getMany();

		return premises;
	}
}
