import { randomUUID } from "crypto";

import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsSelect, Repository } from "typeorm";

import { PickBySelect } from "interfaces/pick_by_select";

import { BaseDto } from "../../common/base/base_dto";
import { BuildingEntity } from "../buildings/buildings.entity";
import { BuildingsService } from "../buildings/buildings.service";
import { ProjectEntity } from "../projects/project.entity";
import { SectionEntity } from "../sections/sections.entity";
import { SectionsService } from "../sections/sections.service";
import { Order } from "../../constants";
import { ProjectService } from "../projects/projects.service";

import { CreatePremisesDto } from "./dtos/CreatePremises.dto";
import { PremisesFilterDto, PremiseSortBy } from "./dtos/PremisesFilter.dto";
import { UpdatePremisesDto } from "./dtos/UpdatePremises.dto";
import { PremiseBasketLinkEntity } from "./entities";
import { PremiseNotFoundError } from "./errors/PremiseNotFound.error";
import { InvalidLinkError } from "./errors/invalid-link.error";
import { PremiseSchemaEntity } from "./premise_schema.entity";
import { PremiseEntity } from "./premises.entity";
import { SeasonEntity } from "./season.entity";

interface PremiseAggregates {
	min_floor: number;
	max_floor: number;
	min_size: number;
	max_size: number;
	min_price: number;
	max_price: number;
}

@Injectable()
export class PremisesService {
	constructor(
		@InjectRepository(PremiseEntity)
		private premiseRepository: Repository<PremiseEntity>,
		@InjectRepository(PremiseSchemaEntity)
		private premiseSchemaRepository: Repository<PremiseSchemaEntity>,
		// @InjectRepository(SeasonEntity)
		// private seasonRepository: Repository<SeasonEntity>,
		@InjectRepository(PremiseBasketLinkEntity)
		private basketLinkRepository: Repository<PremiseBasketLinkEntity>,
		@Inject()
		private buildingService: BuildingsService,
		@Inject()
		private sectionService: SectionsService,
		@Inject()
		private projectService: ProjectService,
	) {}

	get repository(): Repository<PremiseEntity> {
		return this.premiseRepository;
	}

	get schemaRepository(): Repository<PremiseSchemaEntity> {
		return this.premiseSchemaRepository;
	}

	async create(dto: CreatePremisesDto) {
		if (typeof dto.building_id !== "undefined") {
			await this.buildingService.readOne(dto.building_id);
		}
		if (typeof dto.section_id !== "undefined") {
			await this.sectionService.readOne(dto.section_id);
		}
		const premise = this.premiseRepository.create(dto);
		const createdPremise = await this.premiseRepository.save(premise);
		if (dto.schema) {
			const schema = this.premiseSchemaRepository.create(dto.schema);
			schema.premise_id = createdPremise.id;
			const createdSchema =
				await this.premiseSchemaRepository.save(schema);
			await this.premiseRepository.update(createdPremise.id, {
				schema_id: createdSchema.id,
			});
		}
		return createdPremise;
	}

	async createLink(ids: number[], page: number, limit: number) {
		const link = randomUUID();

		const result = this.basketLinkRepository.create({
			link,
			ids,
			page,
			limit,
		});

		await this.basketLinkRepository.save(result);

		return link;
	}

	async premisesByLink(link: string) {
		const data = await this.basketLinkRepository.findOne({
			where: { link },
		});

		if (!data) {
			throw new InvalidLinkError();
		}

		return await this.getMultiplePremisesByIds(
			data.ids,
			data.limit,
			data.page,
		);
	}

	async readOne(id: number, select?: FindOptionsSelect<PremiseEntity>) {
		const foundClient = await this.premiseRepository.findOne({
			select: select ? { id: true, ...select } : undefined, // NOTE: If id is not provided it returns null
			where: {
				id: id,
			},
		});
		if (!foundClient) {
			throw new PremiseNotFoundError(`id: ${id}`);
		}
		return foundClient;
	}

	async readOneWithRelation(id: number): Promise<PremiseEntity> {
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

	async checkExists(id: number): Promise<void> {
		const premise = await this.premiseRepository.existsBy({ id: id });
		if (!premise) {
			throw new PremiseNotFoundError(`id: ${id}`);
		}
	}

	async update(id: number, dto: UpdatePremisesDto) {
		const foundPremise = await this.readOneWithRelation(id);
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
		const foundPremise = await this.readOneWithRelation(id);
		await this.premiseRepository.delete(foundPremise.id);
		return foundPremise;
	}

	async readAllSeason(filter: PremisesFilterDto) {
		const query = this.getPremiseQuery(filter)
			.select(["premise.year AS year", "premise.quarter AS season_name"])
			.distinct(true)
			.groupBy("premise.year")
			.addGroupBy("premise.quarter")
			.orderBy("premise.year", "ASC")
			.addOrderBy("premise.quarter", "ASC");

		const premises = await query.getRawMany<PremiseEntity>();

		return premises;
	}

	getMultiplePremisesByIds(ids: number[], limit: number, page: number) {
		return this.getPremisesFiltered({ ids: ids, limit, page });
	}

	getPremiseQuery(filter: PremisesFilterDto) {
		let query = this.premiseRepository
			.createQueryBuilder("premise")
			.leftJoinAndMapOne(
				"premise.building",
				BuildingEntity,
				"building",
				"building.id = premise.building_id",
			)
			.leftJoinAndMapOne(
				"premise.section",
				SectionEntity,
				"section",
				"section.id = premise.section_id",
			)
			.leftJoinAndMapOne(
				"premise.project",
				ProjectEntity,
				"project",
				"project.id = building.project_id",
			)
			.leftJoinAndMapOne(
				"premise.premise_schema",
				PremiseSchemaEntity,
				"premise_schema",
				"premise_schema.premise_id = premise.id",
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
				if (filter.rooms === "4") {
					query = query.andWhere("premise.rooms >= :rooms", {
						rooms: filter.rooms,
					});
				} else {
					query = query.andWhere("premise.rooms = :rooms", {
						rooms: filter.rooms,
					});
				}
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

			if (filter.season_id) {
				query = query.andWhere("premise.season_id = :season_id", {
					season_id: filter.season_id,
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

			if (filter.year) {
				query = query.andWhere("premise.year = :year", {
					year: filter.year,
				});
			}

			if (filter.quarter) {
				query = query.andWhere("premise.quarter = :quarter", {
					quarter: filter.quarter,
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

		return query;
	}

	async getPremisesFiltered(
		filter: PremisesFilterDto,
	): Promise<BaseDto<PremiseEntity[]>> {
		const pageSize = (filter.page - 1) * filter.limit;
		let query = this.getPremiseQuery(filter);

		query = query
			.leftJoinAndMapOne(
				"premise.season",
				SeasonEntity,
				"season",
				"season.id = premise.season_id",
			)
			.groupBy("premise.id")
			.addGroupBy("building.id")
			.addGroupBy("section.id")
			.addGroupBy("project.id")
			.addGroupBy("season.id")
			.addGroupBy("premise_schema.id");

		switch (filter.sort_by) {
			case PremiseSortBy.PRICE:
				query.orderBy("premise.price", filter.order_by || Order.ASC);
				break;
			case PremiseSortBy.SIZE:
				query.orderBy("premise.size", filter.order_by || Order.ASC);
				break;
			case PremiseSortBy.FLOOR:
				query.orderBy("premise.floor", filter.order_by || Order.ASC);
				break;
			case PremiseSortBy.STATUS:
				query.orderBy("premise.status", filter.order_by || Order.ASC);
				break;
			case PremiseSortBy.NAME:
				query.orderBy("premise.name", filter.order_by || Order.ASC);
				break;
			case PremiseSortBy.BUILDING:
				query.orderBy("building.name", filter.order_by || Order.ASC);
				break;
			default:
				query.orderBy("premise.id", Order.DESC);
				break;
		}
		query = query.select([
			"premise.id",
			"premise.name",
			"premise.type",
			"premise.building",
			"premise.building_id",
			"premise.price",
			"premise.size",
			"premise.status",
			"premise.purchase_option",
			"premise.number",
			"premise.floor",
			"premise.link",
			"premise.feature",
			"premise.ext_id",
			"premise.feature_new",
			"premise.photo",
			"premise.rooms",
			"premise.photos",
			"premise.similiarApartmentCount",
			"premise.mortage_payment",
			"premise.section_id",
			"premise.is_sold",
			"premise.is_booked",
			"premise.year",
			"premise.quarter",
			"building.id",
			"building.name",
			"building.address",
			"building.number_of_floors",
			"building.photos",
			"building.project_id",
			"section.id",
			"section.name",
			"section.building_id",
			"season.id",
			"season.created_at",
			"season.date",
			"season.season_name",
			"season.year",
			"season.date",
			"project.id",
			"project.photo",
			"project.name",
			"project.description",
			"project.end_date",
			"project.location",
			"project.long",
			"project.lat",
			"project.company_link",
			"project.price",
			"project.building_link",
			"project.project_link",
			"project.city_id",
			"premise_schema.id",
			"premise_schema.sunrise_angle",
			"premise_schema.schema_image",
		]);

		if (!filter.id) {
			query = query
				.andWhere("premise.is_sold is FALSE")
				.andWhere(
					"COALESCE((SELECT TRUE FROM bookings b WHERE b.premise_id = premise.id LIMIT 1), FALSE) = FALSE",
				);
		}

		query = query.limit(filter.limit).offset(pageSize);

		const [premises, premiseCount] = await query.getManyAndCount();

		const result = await this.premiseRepository
			.createQueryBuilder("premise")
			.select([
				"MIN(premise.floor) AS min_floor",
				"MAX(premise.floor) AS max_floor",
				"MIN(premise.size) AS min_size",
				"MAX(premise.size) AS max_size",
				"MIN(premise.price) AS min_price",
				"MAX(premise.price) AS max_price",
			])
			.getRawOne<PremiseAggregates>();

		const metaData = BaseDto.create<PremiseEntity[]>();
		metaData.setPagination(premiseCount, filter.page, filter.limit);
		metaData.data = premises;
		metaData.meta.data = { ...result };
		return metaData;
	}

	async chess(payload: PremisesFilterDto) {
		// const { order_by, sort_by } = payload;
		const pageSize = (payload.page - 1) * payload.limit;

		let queryBuilder = this.projectService.repository
			.createQueryBuilder("project")
			.leftJoinAndSelect("project.buildings", "building")
			.leftJoinAndSelect("building.premises", "premise")
			.leftJoinAndSelect("premise.section", "section")
			.select([
				"project.id",
				"project.name",
				"building.id",
				"building.name",
				"premise.id",
				"premise.name",
				"premise.size",
				"premise.price",
				"premise.floor",
				"premise.status",
				"premise.purchase_option",
				"premise.number",
				"premise.feature_new",
				"premise.photo",
				"premise.rooms",
				"premise.photos",
				"premise.quarter",
				"premise.year",
				"premise.section_id",
				"section.id",
				"section.name",
			]);

		if (payload.project_id) {
			queryBuilder.where("project.id = :project_id", {
				project_id: payload.project_id ?? null,
			});
		}

		if (payload.endYear) {
			queryBuilder.andWhere("project.end_date = :end_date", {
				end_date: payload.endYear,
			});
		}

		if (payload.city_id) {
			queryBuilder.andWhere("project.city_id = :city_id", {
				city_id: payload.city_id,
			});
		}

		if (payload.building_id) {
			queryBuilder.andWhere("building.id = :building_id", {
				building_id: payload.building_id,
			});
		}

		if (payload.type) {
			queryBuilder.andWhere("premise.type = :type", {
				type: payload.type,
			});
		}

		if (payload.status) {
			queryBuilder.andWhere("premise.status = :status", {
				status: payload.status,
			});
		}

		if (payload.section_id) {
			queryBuilder.andWhere("premise.section_id = :section_id", {
				section_id: payload.section_id,
			});
		}

		if (payload.year) {
			queryBuilder.andWhere("premise.year = :year", {
				year: payload.year,
			});
		}

		if (payload.quarter) {
			queryBuilder.andWhere("premise.quarter = :quarter", {
				quarter: payload.quarter,
			});
		}

		if (payload.purchaseOption) {
			queryBuilder.andWhere(
				"premise.purchase_option = :purchase_option",
				{ purchase_option: payload.purchaseOption },
			);
		}

		if (payload.rooms) {
			if (payload.rooms === "4") {
				queryBuilder = queryBuilder.andWhere(
					"premise.rooms >= :rooms",
					{
						rooms: payload.rooms,
					},
				);
			} else {
				queryBuilder = queryBuilder.andWhere("premise.rooms = :rooms", {
					rooms: payload.rooms,
				});
			}
		}

		if (payload.min_floor) {
			queryBuilder = queryBuilder.andWhere(
				"premise.floor >= :min_floor",
				{
					min_floor: payload.min_floor,
				},
			);
		}

		if (payload.max_floor) {
			queryBuilder = queryBuilder.andWhere(
				"premise.floor <= :max_floor",
				{
					max_floor: payload.max_floor,
				},
			);
		}

		if (payload.min_number) {
			queryBuilder = queryBuilder.andWhere(
				"premise.number >= :min_number",
				{
					min_number: payload.min_number,
				},
			);
		}

		if (payload.max_number) {
			queryBuilder = queryBuilder.andWhere(
				"premise.number <= :max_number",
				{
					max_number: payload.max_number,
				},
			);
		}

		if (payload.min_price) {
			queryBuilder = queryBuilder.andWhere(
				"premise.price >= :min_price",
				{
					min_price: payload.min_price,
				},
			);
		}

		if (payload.max_price) {
			queryBuilder = queryBuilder.andWhere(
				"premise.price <= :max_price",
				{
					max_price: payload.max_price,
				},
			);
		}

		if (payload.min_size) {
			queryBuilder = queryBuilder.andWhere("premise.size >= :min_size", {
				min_size: payload.min_size,
			});
		}

		if (payload.max_size) {
			queryBuilder = queryBuilder.andWhere("premise.size <= :max_size", {
				max_size: payload.max_size,
			});
		}

		queryBuilder = queryBuilder
			.andWhere("premise.is_sold is FALSE")
			.andWhere(
				"COALESCE((SELECT TRUE FROM bookings b WHERE b.premise_id = premise.id LIMIT 1), FALSE) = FALSE",
			);

		queryBuilder.take(payload.limit).skip(pageSize);

		const [projects, projectCount] = await queryBuilder.getManyAndCount();

		const metaData = BaseDto.create<ProjectEntity[]>();
		metaData.setPagination(projectCount, payload.page, payload.limit);
		metaData.data = projects;
		return metaData;
	}

	async readOneByExtId<T extends FindOptionsSelect<PremiseEntity>>(
		ext_id: string,
		select?: T,
	): Promise<PickBySelect<PremiseEntity, T>> {
		const client = await this.premiseRepository.findOne({
			select: select,
			where: { ext_id: ext_id },
		});
		if (!client) {
			throw new PremiseNotFoundError(`ext_id: ${ext_id}`);
		}
		return client;
	}
}
