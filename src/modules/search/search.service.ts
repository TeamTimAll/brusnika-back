import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import { BaseDto, Pagination } from "../../common/base/base_dto";
import { BuildingEntity } from "../buildings/buildings.entity";
import { ClientEntity } from "../client/client.entity";
import { EventsEntity } from "../events/events.entity";
import { LeadsEntity } from "../leads/leads.entity";
import { NewsEntity } from "../news/news.entity";
import { ProjectEntity } from "../projects/project.entity";

import { SearchDto } from "./dto/Search.dto";

interface BaseResponse {
	count: number;
	page: number;
	limit: number;
}

interface ClientSearchData extends BaseResponse {
	module_name: "client";
	data: ClientEntity[];
}

interface ProjectSearchData extends BaseResponse {
	module_name: "project";
	data: ProjectEntity[];
}

interface BuildingSearchData extends BaseResponse {
	module_name: "building";
	data: BuildingEntity[];
}

interface LeadsSearchData extends BaseResponse {
	module_name: "leads";
	data: LeadsEntity[];
}

interface NewsSearchData extends BaseResponse {
	module_name: "news";
	data: NewsEntity[];
}

interface EventsSearchData extends BaseResponse {
	module_name: "events";
	data: EventsEntity[];
}

export type SearchData =
	| ClientSearchData
	| ProjectSearchData
	| BuildingSearchData
	| LeadsSearchData
	| NewsSearchData
	| EventsSearchData;

type SearchResponse = Omit<SearchData, "count" | "limit" | "page">;

@Injectable()
export class SearchService {
	constructor(private dataSource: DataSource) {}

	async search(dto: SearchDto): Promise<BaseDto<SearchResponse[]>> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		const manager = queryRunner.manager;
		try {
			const pageSize = (dto.page - 1) * dto.limit;
			const searchResponse: SearchData[] = [];
			const paginations: Pagination[] = [];
			const [clients, clientsCount] = await manager
				.createQueryBuilder(ClientEntity, "c")
				.where("c.is_active IS TRUE")
				.andWhere("c.fullname ILIKE :text", { text: `%${dto.text}%` })
				.orWhere("c.phone_number ILIKE :text", {
					text: `%${dto.text}%`,
				})
				.limit(dto.limit)
				.offset(pageSize)
				.getManyAndCount();
			if (clients.length) {
				searchResponse.push({
					module_name: "client",
					data: clients,
					count: clientsCount,
					page: dto.page,
					limit: dto.limit,
				});
			}

			const [projects, projectsCount] = await manager
				.createQueryBuilder(ProjectEntity, "p")
				.where("p.is_active IS TRUE")
				.andWhere("p.name ILIKE :text", { text: `%${dto.text}%` })
				.orWhere("p.detailed_description ILIKE :text", {
					text: `%${dto.text}%`,
				})
				.orWhere("p.brief_description ILIKE :text", {
					text: `%${dto.text}%`,
				})
				.limit(dto.limit)
				.offset(pageSize)
				.getManyAndCount();
			if (projects.length) {
				searchResponse.push({
					module_name: "project",
					data: projects,
					count: projectsCount,
					page: dto.page,
					limit: dto.limit,
				});
			}

			const [buildings, buildingsCount] = await manager
				.createQueryBuilder(BuildingEntity, "b")
				.where("b.is_active IS TRUE")
				.andWhere("b.name ILIKE :text", { text: `%${dto.text}%` })
				.limit(dto.limit)
				.offset(pageSize)
				.getManyAndCount();
			if (buildings.length) {
				searchResponse.push({
					module_name: "building",
					data: buildings,
					count: buildingsCount,
					page: dto.page,
					limit: dto.limit,
				});
			}

			const [leads, leadsCount] = await manager
				.createQueryBuilder(LeadsEntity, "l")
				.where("l.is_active IS TRUE")
				.andWhere("l.state ILIKE :text", { text: `%${dto.text}%` })
				.orWhere("l.current_status ILIKE :text", {
					text: `%${dto.text}%`,
				})
				.limit(dto.limit)
				.offset(pageSize)
				.getManyAndCount();
			if (leads.length) {
				searchResponse.push({
					module_name: "leads",
					data: leads,
					count: leadsCount,
					page: dto.page,
					limit: dto.limit,
				});
			}

			const [news, newsCount] = await manager
				.createQueryBuilder(NewsEntity, "n")
				.where("n.is_active IS TRUE")
				.andWhere("n.title ILIKE :text", { text: `%${dto.text}%` })
				.andWhere("n.content ILIKE :text", { text: `%${dto.text}%` })
				.limit(dto.limit)
				.offset(pageSize)
				.getManyAndCount();
			if (news.length) {
				searchResponse.push({
					module_name: "news",
					data: news,
					count: newsCount,
					page: dto.page,
					limit: dto.limit,
				});
			}

			const [events, eventsCount] = await manager
				.createQueryBuilder(EventsEntity, "e")
				.where("e.is_active IS TRUE")
				.andWhere("e.title ILIKE :text", { text: `%${dto.text}%` })
				.andWhere("e.description ILIKE :text", {
					text: `%${dto.text}%`,
				})
				.limit(dto.limit)
				.offset(pageSize)
				.getManyAndCount();
			if (events.length) {
				searchResponse.push({
					module_name: "events",
					data: events,
					count: eventsCount,
					page: dto.page,
					limit: dto.limit,
				});
			}

			await queryRunner.commitTransaction();

			searchResponse.forEach((s) => {
				paginations.push({
					module_name: s.module_name,
					count: s.count,
					limit: s.limit,
					page: s.page,
				});
			});

			const metaData = BaseDto.create<SearchResponse[]>();
			metaData.setPaginations(paginations);
			metaData.data = searchResponse.map((e) => ({
				module_name: e.module_name,
				data: e.data,
			}));
			return metaData;
		} catch (e) {
			await queryRunner.rollbackTransaction();
			throw e;
		} finally {
			await queryRunner.release();
		}
	}
}
