import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";

import { ProjectService } from "../../projects/projects.service";
import { CityService } from "../../cities/cities.service";

import { ProjectDto, ProjectsDto } from "./dto";
import { IProject } from "./types";

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
			.execute();
	}

	async createProjects({ projects }: ProjectsDto) {
		const preparedValues: IProject[] = [];

		for await (const project of projects) {
			const city = await this.cityService.readOneByExtId(
				project.city_ext_id,
				{ id: true },
			);

			if (!city) {
				throw new NotFoundException();
			}

			preparedValues.push({
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
			});
		}

		if (preparedValues.length > 0) {
			return this.projectService.repository
				.createQueryBuilder()
				.insert()
				.values(preparedValues)
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
		} else {
			throw new BadRequestException("No valid project data to insert.");
		}
	}
}
