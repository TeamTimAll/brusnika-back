import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";

import { BaseDto } from "../../common/base/base_dto";
import { BuildingEntity } from "../buildings/buildings.entity";
import { BuildingsService } from "../buildings/buildings.service";
import { ProjectEntity } from "../projects/project.entity";
import { SectionEntity } from "../sections/sections.entity";
import { SectionsService } from "../sections/sections.service";

import { CreatePremisesDto } from "./dtos/CreatePremises.dto";
import { PremisesFilterDto } from "./dtos/PremisesFilter.dto";
import { UpdatePremisesDto } from "./dtos/UpdatePremises.dto";
import { PremiseEntity } from "./premises.entity";
import { SeasonEntity } from "./season.entity";

@Injectable()
export class PremisesService {
	constructor(
		@InjectRepository(PremiseEntity)
		private premiseRepository: Repository<PremiseEntity>,
		@InjectRepository(SeasonEntity)
		private seasonRepository: Repository<SeasonEntity>,
		@Inject()
		private buildingService: BuildingsService,
		@Inject()
		private sectionService: SectionsService,
	) {}

	get repository(): Repository<PremiseEntity> {
		return this.premiseRepository;
	}

	async create(dto: CreatePremisesDto) {
		if (typeof dto.building_id !== "undefined") {
			await this.buildingService.readOne(dto.building_id);
		}
		if (typeof dto.section_id !== "undefined") {
			await this.sectionService.readOne(dto.section_id);
		}
		const premise = this.premiseRepository.create(dto);
		return await this.premiseRepository.save(premise);
	}

	async readOne(id: number): Promise<PremiseEntity> {
		const premises = await this.getPremisesFiltered({
			id: id,
			limit: 1,
			page: 1,
		});
		if (!premises.data.length) {
			return {} as PremiseEntity;
		}
		return premises.data[0];
	}

	async update(id: number, dto: UpdatePremisesDto) {
		const foundPremise = await this.readOne(id);
		if (typeof dto.building_id !== "undefined") {
			await this.buildingService.readOne(dto.building_id);
		}
		if (typeof dto.section_id !== "undefined") {
			await this.sectionService.readOne(dto.section_id);
		}
		const mergedPremise = this.premiseRepository.merge(foundPremise, dto);
		return await this.premiseRepository.save(mergedPremise);
	}

	async delete(id: number) {
		const foundPremise = await this.readOne(id);
		await this.premiseRepository.delete(foundPremise.id);
		return foundPremise;
	}

	async readAllSeason(filter: PremisesFilterDto) {
		const query = this.getPremiseQuery(filter).select(["premise.id as id"]);
		const premises = await query.getRawMany<PremiseEntity>();
		const premiseIds: number[] = premises.map((e) => e.id);
		return this.seasonRepository.find({
			select: {
				id: true,
				created_at: true,
				updated_at: true,
				season_name: true,
				year: true,
				date: true,
				premise: {
					id: false,
				},
			},
			relations: { premise: true },
			where: {
				premise: {
					id: In(premiseIds),
				},
			},
		});
	}

	getMultiplePremisesByIds(ids: number[], limit: number, page: number) {
		return this.getPremisesFiltered({ ids: ids, limit, page });
	}

	getPremiseQuery(filter: PremisesFilterDto) {
		let query = this.premiseRepository
			.createQueryBuilder("premise")
			.leftJoin(
				BuildingEntity,
				"building",
				"building.id = premise.building_id",
			)
			.leftJoin(
				SectionEntity,
				"section",
				"section.id = premise.section_id",
			)
			.leftJoin(
				ProjectEntity,
				"project",
				"project.id = building.project_id",
			);

		if (filter) {
			if (filter.id) {
				query = query.andWhere("premise.id = :id", {
					id: filter.id,
				});
			}

			if (filter.ids && filter.ids.length) {
				query = query.andWhere("premise.id in (:...ids)", {
					ids: filter.ids,
				});
			}

			if (filter.city_id) {
				query = query.andWhere("project.city_id = :city_id", {
					city_id: filter.city_id,
				});
			}

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

		const pageSize = (filter.page - 1) * filter.limit;
		return query
			.limit(filter.limit)
			.offset(pageSize)
			.groupBy("premise.id")
			.addGroupBy("building.id")
			.addGroupBy("section.id")
			.addGroupBy("project.id")
			.orderBy("project.id", "ASC");
	}

	async getPremisesFiltered(
		filter: PremisesFilterDto,
	): Promise<BaseDto<PremiseEntity[]>> {
		let query = this.getPremiseQuery(filter).leftJoin(
			SeasonEntity,
			"season",
			"season.id = premise.season_id",
		);

		const premiseCount = await query
			.select("COUNT(premise.id)::int AS premise_count")
			.getRawMany<Record<"premise_count", number>>();

		query = query
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
				"premise.mortage_payment as mortagePayment",
				"premise.section_id as section_id",
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
				'id',			season.id,
				'created_at',	season.created_at,
				'updated_at',	season.created_at,
				'season_name',	season.season_name,
				'year',			season.year,
				'date',			season.date
			)) as season`,
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
			.addGroupBy("season.id");

		const premises = await query.getRawMany<PremiseEntity>();

		const metaData = BaseDto.create<PremiseEntity[]>();
		metaData.calcPagination(
			premiseCount.length ? premiseCount[0].premise_count : 0,
			filter.page,
			filter.limit,
		);
		metaData.data = premises;
		return metaData;
	}
}
