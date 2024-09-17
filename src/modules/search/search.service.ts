import { Injectable } from "@nestjs/common";
import { Brackets, DataSource } from "typeorm";

import { RoleType } from "../../constants";
import { ICurrentUser } from "../../interfaces/current-user.interface";
import { ClientEntity } from "../client/client.entity";
import { EventsEntity } from "../events/events.entity";
import { NewsEntity } from "../news/news.entity";
import { ProjectEntity } from "../projects/project.entity";
import { UserEntity } from "../user/user.entity";

import { SearchDto } from "./dto/Search.dto";

interface ClientSearchData {
	module_name: "client";
	data: Pick<ClientEntity, "id" | "fullname" | "phone_number">[];
}

interface ProjectSearchData {
	module_name: "projects";
	data: ProjectEntity[];
}

interface NewsSearchData {
	module_name: "news";
	data: NewsEntity[];
}

interface EventsSearchData {
	module_name: "events";
	data: EventsEntity[];
}

export type SearchData =
	| ClientSearchData
	| ProjectSearchData
	| NewsSearchData
	| EventsSearchData;

@Injectable()
export class SearchService {
	constructor(private dataSource: DataSource) {}

	async search(dto: SearchDto, user: ICurrentUser): Promise<SearchData[]> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		const manager = queryRunner.manager;
		try {
			const pageSize = (dto.page - 1) * dto.limit;
			const searchResponse: SearchData[] = [];
			let clientsQuery = manager
				.createQueryBuilder(ClientEntity, "c")
				.select([
					"c.id",
					"c.fullname",
					"c.phone_number",
				] as Array<`c.${keyof ClientEntity}`>)
				.where("c.is_active IS TRUE")
				.limit(dto.limit)
				.offset(pageSize);

			if (user.role === RoleType.AGENT) {
				clientsQuery = clientsQuery.andWhere(
					"c.agent_id = :client_agent_id",
					{
						client_agent_id: user.user_id,
					},
				);
			} else if (user.role === RoleType.HEAD_OF_AGENCY) {
				const foundUser = await manager
					.createQueryBuilder(UserEntity, "u")
					.select(["u.agency_id"] as Array<`u.${keyof UserEntity}`>)
					.where("u.id = :user_id", { user_id: user.user_id })
					.getOne();
				clientsQuery = clientsQuery.andWhere(
					(qb) =>
						"c.agent_id IN (" +
						qb
							.subQuery()
							.from(UserEntity, "u")
							.select("u.id")
							.where("u.agency_id = :agency_id", {
								agency_id: foundUser?.agency_id,
							})
							.getQuery() +
						")",
				);
			}

			clientsQuery = clientsQuery.andWhere(
				new Brackets((qb) =>
					qb
						.where("c.fullname ILIKE :fullname", {
							fullname: `%${dto.text}%`,
						})
						.orWhere("c.phone_number ILIKE :phone_number", {
							phone_number: `%${dto.text}%`,
						}),
				),
			);

			const clients = await clientsQuery.getMany();

			if (clients.length) {
				searchResponse.push({
					module_name: "client",
					data: clients,
				});
			}

			const projects = await manager
				.createQueryBuilder(ProjectEntity, "p")
				.select(["p.id", "p.name"] as Array<`p.${keyof ProjectEntity}`>)
				.where("p.is_active IS TRUE")
				.andWhere(
					new Brackets((qb) =>
						qb
							.where("p.name ILIKE :text", {
								text: `%${dto.text}%`,
							})
							.orWhere("p.detailed_description ILIKE :text", {
								text: `%${dto.text}%`,
							})
							.orWhere("p.brief_description ILIKE :text", {
								text: `%${dto.text}%`,
							}),
					),
				)
				.limit(dto.limit)
				.offset(pageSize)
				.getMany();
			if (projects.length) {
				searchResponse.push({
					module_name: "projects",
					data: projects,
				});
			}

			let newsQuery = manager
				.createQueryBuilder(NewsEntity, "n")
				.select(["n.id", "n.title"] as Array<`n.${keyof NewsEntity}`>)
				.where("n.is_active IS TRUE")
				.andWhere("n.title ILIKE :text", { text: `%${dto.text}%` })
				.limit(dto.limit)
				.offset(pageSize);

			if (user.role !== RoleType.ADMIN) {
				newsQuery = newsQuery.andWhere("n.is_draft IS FALSE");
			}
			if (user.role !== RoleType.ADMIN) {
				newsQuery = newsQuery.andWhere("n.access = :role", {
					role: user.role,
				});
			}

			newsQuery = newsQuery.orWhere("n.content ILIKE :text", {
				text: `%${dto.text}%`,
			});

			const news = await newsQuery.getMany();

			if (news.length) {
				searchResponse.push({
					module_name: "news",
					data: news,
				});
			}

			const events = await manager
				.createQueryBuilder(EventsEntity, "e")
				.select(["e.id", "e.title"] as Array<`e.${keyof EventsEntity}`>)
				.where("e.is_active IS TRUE")
				.andWhere(
					new Brackets((qb) =>
						qb
							.where("e.title ILIKE :text", {
								text: `%${dto.text}%`,
							})
							.orWhere("e.description ILIKE :text", {
								text: `%${dto.text}%`,
							}),
					),
				)
				.limit(dto.limit)
				.offset(pageSize)
				.getMany();
			if (events.length) {
				searchResponse.push({
					module_name: "events",
					data: events,
				});
			}

			await queryRunner.commitTransaction();
			return searchResponse;
		} catch (e) {
			await queryRunner.rollbackTransaction();
			throw e;
		} finally {
			await queryRunner.release();
		}
	}
}
