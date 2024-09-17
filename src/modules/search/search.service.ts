import { Injectable } from "@nestjs/common";

import { BaseDto, MetaLinkWithModule } from "../../common/base/base_dto";
import { ICurrentUser } from "../../interfaces/current-user.interface";
import { ClientEntity } from "../client/client.entity";
import { ClientService } from "../client/client.service";
import { EventsEntity } from "../events/events.entity";
import { EventsService } from "../events/events.service";
import { NewsEntity } from "../news/news.entity";
import { NewsService } from "../news/news.service";
import { ProjectEntity } from "../projects/project.entity";
import { ProjectService } from "../projects/projects.service";

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
	constructor(
		private clientService: ClientService,
		private projectService: ProjectService,
		private newsService: NewsService,
		private eventsService: EventsService,
	) {}

	async search(
		dto: SearchDto,
		user: ICurrentUser,
	): Promise<BaseDto<SearchData[]>> {
		const searchResponse: SearchData[] = [];
		const links: MetaLinkWithModule[] = [];

		const clients = await this.clientService.search(dto, user);
		if (clients.data.length) {
			searchResponse.push({
				module_name: "client",
				data: clients.data,
			});
			links.push({
				module_name: "client",
				...clients.getPagination(),
			});
		}

		const projects = await this.projectService.search(dto);
		if (projects.data.length) {
			searchResponse.push({
				module_name: "projects",
				data: projects.data,
			});
			links.push({
				module_name: "projects",
				...projects.getPagination(),
			});
		}

		const news = await this.newsService.search(dto, user);
		if (news.data.length) {
			searchResponse.push({
				module_name: "news",
				data: news.data,
			});
			links.push({
				module_name: "news",
				...news.getPagination(),
			});
		}

		const events = await this.eventsService.search(dto);
		if (events.data.length) {
			searchResponse.push({
				module_name: "events",
				data: events.data,
			});
			links.push({
				module_name: "events",
				...events.getPagination(),
			});
		}

		const metaData = BaseDto.create<SearchData[]>();
		metaData.setLinks(links);
		metaData.data = searchResponse;
		return metaData;
	}
}
