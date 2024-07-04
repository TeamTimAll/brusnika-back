import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

import { BasicService } from "../../generic/service";
import { BuildingsEntity } from "../buildings/buildings.entity";
import { ProjectEntity } from "../projects/project.entity";
import { SectionsEntity } from "../sections/sections.entity";

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

	readOne(id: string) {
		return this.repository.findOne({
			where: {
				id: id,
			},
			relations: {
				section: true,
				building: true,
			},
		});
	}

	async getMultiplePremisesByIds(ids: string[]) {
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
			.select([
				"premise.id as id",
				"premise.name as name",
				"premise.type as type",
				"premise.building as building",
				"premise.building_id as building_id",
				"premise.price as price",
				"premise.size as size",
				"premise.status as status",
				"premise.purchase_option as purchaseOption",
				"premise.number as number",
				"premise.floor as floor",
				"premise.photo as photo",
				"premise.rooms as rooms",
				"premise.photos as photos",
				"premise.similiar_apartment_count as similiarApartmentCount",
				"premise.title as title",
				"premise.end_date as end_date",
				"premise.mortage_payment as mortagePayment",
				"premise.section_id as section_id",
				"premise.is_open_booking as is_open_booking",
				"premise.is_sold as is_sold",
				`JSON_STRIP_NULLS(JSON_BUILD_OBJECT(
					'id', 							building.id,
					'name', 						building.name,
					'total_storage', 				building.total_storage,
					'total_vacant_storage', 		building.total_vacant_storage,
					'total_parking_space', 			building.total_parking_space,
					'total_vacant_parking_space', 	building.total_vacant_parking_space,
					'total_commercial', 			building.total_commercial,
					'total_vacant_commercial', 		building.total_vacant_commercial,
					'address', 						building.address,
					'number_of_floors', 			building.number_of_floors,
					'photos', 						building.photos,
					'project_id', 					building.project_id,
					'created_at', 					building."created_at",
					'updated_at', 					building."updated_at"
				)) as building`,
				`JSON_STRIP_NULLS(JSON_BUILD_OBJECT(
					'id',			section.id,
					'name',			section.name,
					'building_id',	section.building_id
				)) as section`,
				`JSON_STRIP_NULLS(JSON_BUILD_OBJECT(
					'id',					project.id,
					'name',					project.name,
					'detailed_description',	project.detailed_description,
					'brief_description',	project.brief_description,
					'photo',				project.photo,
					'price',				project.price,
					'location',				project.location,
					'long',					project.long,
					'lat',					project.lat,
					'link',					project.link,
					'end_date',				project.end_date,
					'city_id',				project.city_id
				)) as project`,
			])
			.addSelect(
				"COALESCE((SELECT TRUE FROM bookings b WHERE b.premise_id = premise.id LIMIT 1), FALSE) AS is_booked",
			)
			.leftJoin(
				BuildingsEntity,
				"building",
				"building.id = premise.building_id",
			)
			.leftJoin(
				SectionsEntity,
				"section",
				"section.id = premise.section_id",
			)
			.leftJoin(
				ProjectEntity,
				"project",
				"project.id = building.project_id",
			);

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

			if (filter.purchaseOption) {
				query = query.andWhere(
					"premise.purchaseOption = :purchaseOption",
					{
						purchaseOption: filter.purchaseOption,
					},
				);
			}
		}

		const premises = await query.getRawMany<PremisesEntity>();

		return premises;
	}
}
