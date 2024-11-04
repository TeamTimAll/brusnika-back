import { Injectable } from "@nestjs/common";

import { ProjectService } from "../../projects/projects.service";
import { CityService } from "../../cities/cities.service";

import { ProjectDto } from "./dto";

@Injectable()
export class ProjectQueueService {
	constructor(
		private readonly projectService: ProjectService,
		private readonly cityService: CityService,
	) {}
	async createOrUpdateProject(project: ProjectDto) {
		const city = await this.cityService.readOneByExtId(
			project.city_ext_id,
			{ id: true },
		);

		return this.projectService.repository
			.createQueryBuilder()
			.insert()
			.values({
				ext_id: project.ext_id,
				photo: project.photo,
				name: project.name,
				description: project.description,
				location: project.location,
				long: project.long,
				lat: project.lat,
				end_date: project.end_date,
				company_link: project.company_link,
				building_link: project.building_link,
				project_link: project.project_link,
				price: project.price,
				city_id: city.id,
			})
			.orUpdate(
				[
					"photo",
					"name",
					"description",
					"location",
					"long",
					"lat",
					"end_date",
					"company_link",
					"building_link",
					"project_link",
					"price",
					"city_id",
				],
				["ext_id"],
			)
			.execute();
	}
}
