import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { BuildingEntity } from "../buildings/buildings.entity";
import { ClientEntity } from "../client/client.entity";
import { ProjectEntity } from "../projects/project.entity";

interface ClientSearchResponse {
	module_name: "client";
	data: ClientEntity[];
}

interface ProjectSearchResponse {
	module_name: "project";
	data: ProjectEntity[];
}

interface BuildingSearchResponse {
	module_name: "building";
	data: BuildingEntity[];
}

type SearchResponse =
	| ClientSearchResponse
	| ProjectSearchResponse
	| BuildingSearchResponse;

@Injectable()
export class SearchService {
	constructor(
		@InjectRepository(ClientEntity)
		private readonly clientRepository: Repository<ClientEntity>,
		@InjectRepository(ProjectEntity)
		private readonly projectRepository: Repository<ProjectEntity>,
		@InjectRepository(BuildingEntity)
		private readonly buildingRepository: Repository<BuildingEntity>,
	) {}

	async search(text: string): Promise<SearchResponse[]> {
		const searchResponse: SearchResponse[] = [];
		const clients = await this.clientRepository
			.createQueryBuilder("c")
			.where("c.is_active IS TRUE")
			.orWhere("c.fullname ILIKE :text", { text: `%${text}%` })
			.orWhere("c.phone_number ILIKE :text", { text: `%${text}%` })
			.getMany();
		if (clients.length) {
			searchResponse.push({
				module_name: "client",
				data: clients,
			});
		}
		const projects = await this.projectRepository
			.createQueryBuilder("p")
			.where("p.is_active IS TRUE")
            .orWhere("p.name ILIKE :text", { text: `%${text}%` })
            .orWhere("p.detailed_description ILIKE :text", { text: `%${text}%` })
            .orWhere("p.brief_description ILIKE :text", { text: `%${text}%` })
			.getMany();
		if (projects.length) {
			searchResponse.push({
				module_name: "project",
				data: projects,
			});
		}
		const buildings = await this.buildingRepository
			.createQueryBuilder("b")
			.where("b.is_active IS TRUE")
            .orWhere("b.name ILIKE :text", { text: `%${text}%` })
			.getMany();
		if (buildings.length) {
			searchResponse.push({
				module_name: "building",
				data: buildings,
			});
		}
		return searchResponse;
	}
}
