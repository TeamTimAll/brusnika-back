import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Uuid } from "boilerplate.polyfill";

import { PremisesEntity, PremisesType } from "../premises/premises.entity";

import { CreateProjectDto } from "./dto/project.create.dto";
import { UpdateProjectDto } from "./dto/projects.update.dto";
import { ProjectNotFoundError } from "./errors/ProjectNotFound.error";
import { ProjectEntity } from "./project.entity";

type PremisesTypeKeys = keyof typeof PremisesType;

type ProjectRaw = {
	[key in `${Lowercase<PremisesTypeKeys>}_count`]: number;
};

export interface GetAllProjectRaw extends ProjectRaw {
	id: ProjectEntity["id"];
	name: ProjectEntity["name"];
	detailed_description: ProjectEntity["detailed_description"];
	brief_description: ProjectEntity["brief_description"];
	photo: ProjectEntity["photo"];
	price: ProjectEntity["price"];
	location: ProjectEntity["location"];
	long: ProjectEntity["long"];
	lat: ProjectEntity["lat"];
	link: ProjectEntity["link"];
	end_date: ProjectEntity["end_date"];
	premise_type: PremisesEntity["type"];
	premise_count: string;
}

@Injectable()
export class ProjectsService {
	constructor(
		@InjectRepository(ProjectEntity)
		private projectsRepository: Repository<ProjectEntity>,
	) {}

	get repository(): Repository<ProjectEntity> {
		return this.projectsRepository;
	}

	async getAllProjects(): Promise<GetAllProjectRaw[]> {
		const rawResult = await this.projectsRepository
			.createQueryBuilder("project")
			.leftJoinAndSelect("project.buildings", "building")
			.leftJoinAndSelect("building.premises", "premise")
			.select([
				"project.id AS id",
				"project.name AS name",
				"project.detailed_description AS detailed_description",
				"project.brief_description AS brief_description",
				"project.photo AS photo",
				"project.price AS price",
				"project.location AS location",
				"project.long AS long",
				"project.lat AS lat",
				"project.link AS link",
				"project.end_date AS end_date",
				"premise.type AS premise_type",
				"COUNT(premise.id) AS premise_count",
			])
			.groupBy("project.id, premise.type")
			.getRawMany<GetAllProjectRaw>();

		const validTypes = Object.values(PremisesType);

		const formattedResult = rawResult.reduce<GetAllProjectRaw[]>(
			(acc, row) => {
				const projectId = row.id;

				let project = acc.find((p) => p.id === projectId);
				if (typeof project === "undefined") {
					project = {
						id: row.id,
						name: row.name,
						detailed_description: row.detailed_description,
						brief_description: row.brief_description,
						photo: row.photo,
						price: row.price,
						location: row.location,
						long: row.long,
						lat: row.lat,
						link: row.link,
						end_date: row.end_date,
						premise_count: row.premise_count,
						premise_type: row.premise_type,
						apartment_count: 0,
						commercial_count: 0,
						parking_count: 0,
						storeroom_count: 0,
					};
					validTypes.forEach((type) => {
						if (typeof project !== "undefined") {
							project[`${type.toLowerCase()}_count`] = 0;
						}
					});
					acc.push(project);
				}

				if (validTypes.includes(row.premise_type)) {
					project[`${row.premise_type.toLowerCase()}_count`] =
						parseInt(row.premise_count, 10);
				}

				return acc;
			},
			[],
		);

		if (!formattedResult.length) {
			throw new ProjectNotFoundError("Projects not found");
		}

		return formattedResult;
	}

	async createProjects(createProjectDto: CreateProjectDto) {
		const newProject = await this.projectsRepository.save(createProjectDto);

		return newProject;
	}

	async getOneProject(id: Uuid): Promise<ProjectEntity | null> {
		const project = await this.projectsRepository.findOne({
			where: { id },
			relations: {
				buildings: true,
			},
		});
		return project;
	}

	async getUniqueEndDates() {
		const uniqueEndDates = await this.projectsRepository
			.createQueryBuilder("project")
			.select("DISTINCT project.end_date", "end_date")
			.getRawMany<ProjectEntity>();

		if (!uniqueEndDates.length) {
			throw new ProjectNotFoundError("Project dates not found");
		}

		return uniqueEndDates.map((entry) => ({ end_date: entry.end_date }));
	}

	async updateProject(
		project_id: Uuid,
		updateProjectDto: UpdateProjectDto,
	): Promise<ProjectEntity> {
		const project = await this.projectsRepository.findOne({
			where: { id: project_id },
		});

		if (!project) {
			throw new ProjectNotFoundError("Project not found");
		}

		const updatedProject = this.projectsRepository.merge(
			project,
			updateProjectDto,
		);
		await this.projectsRepository.save(updatedProject);

		return updatedProject;
	}

	async deleteProject(id: Uuid): Promise<ProjectEntity> {
		const project = await this.projectsRepository.findOne({
			where: { id },
		});

		if (!project) {
			throw new ProjectNotFoundError("Project not found");
		}

		await this.projectsRepository.remove(project);
		return project;
	}
}
