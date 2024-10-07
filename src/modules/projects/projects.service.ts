import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOptionsSelect, Repository } from "typeorm";

import { BaseDto } from "../../common/base/base_dto";
import { CityService } from "../cities/cities.service";
import { PremiseEntity, PremisesType } from "../premises/premises.entity";

import { CreateProjectDto } from "./dto/CreateProject.dto";
import { ProjectSearchDto } from "./dto/ProjectSearch.dto";
import { UpdateProjectDto } from "./dto/UpdateProject.dto";
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
	premise_type: PremiseEntity["type"];
	premise_count: string;
	city: {
		id: number;
		name: string;
		lat: string;
		long: string;
	};
}

export interface UniqueEndDateResponse {
	end_date: Date;
}

@Injectable()
export class ProjectService {
	constructor(
		@InjectRepository(ProjectEntity)
		private projectsRepository: Repository<ProjectEntity>,
		@Inject()
		private cityService: CityService,
	) {}

	get repository(): Repository<ProjectEntity> {
		return this.projectsRepository;
	}

	async search(dto: ProjectSearchDto): Promise<BaseDto<ProjectEntity[]>> {
		const pageSize = (dto.page - 1) * dto.limit;
		const [projects, projectCount] = await this.projectsRepository
			.createQueryBuilder("p")
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
			.getManyAndCount();

		const metaData = BaseDto.create<ProjectEntity[]>();
		metaData.setPagination(projectCount, dto.page, dto.limit);
		metaData.data = projects;
		return metaData;
	}

	async getAllProjects(city_id?: number): Promise<GetAllProjectRaw[]> {
		let projectQueryBuilder = this.projectsRepository
			.createQueryBuilder("project")
			.leftJoinAndSelect("project.buildings", "building")
			.leftJoinAndSelect("building.premises", "premise")
			.leftJoinAndSelect("project.city", "cities")
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
				"JSON_BUILD_OBJECT('id', cities.id, 'name', cities.name, 'lat', cities.lat, 'long', cities.long) as city",
			])
			.groupBy("project.id")
			.addGroupBy("premise.type")
			.addGroupBy("cities.id");
		if (city_id) {
			projectQueryBuilder = projectQueryBuilder.where(
				"city_id = :city_id",
				{
					city_id: city_id,
				},
			);
		}

		const projects =
			await projectQueryBuilder.getRawMany<GetAllProjectRaw>();

		const validTypes = Object.values(PremisesType);

		const formattedResult = projects.reduce<GetAllProjectRaw[]>(
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
						city: {
							id: row.city.id,
							name: row.city.name,
							lat: row.city.lat,
							long: row.city.long,
						},
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

	async create(dto: CreateProjectDto) {
		await this.cityService.readOne(dto.city_id);
		const project = this.projectsRepository.create(dto);
		return await this.projectsRepository.save(project);
	}

	async getOneProject(id: number): Promise<ProjectEntity | null> {
		const project = await this.projectsRepository.findOne({
			where: { id },
			relations: {
				buildings: true,
			},
		});
		return project;
	}

	async getUniqueEndDates(): Promise<UniqueEndDateResponse[]> {
		const uniqueEndDates = await this.projectsRepository
			.createQueryBuilder("project")
			.select("DISTINCT project.end_date", "end_date")
			.getRawMany<ProjectEntity>();

		if (!uniqueEndDates.length) {
			throw new ProjectNotFoundError("Project dates not found");
		}

		return uniqueEndDates.map<UniqueEndDateResponse>((entry) => ({
			end_date: entry.end_date,
		}));
	}

	async update(
		project_id: number,
		dto: UpdateProjectDto,
	): Promise<ProjectEntity> {
		const project = await this.projectsRepository.findOne({
			where: { id: project_id },
		});
		if (!project) {
			throw new ProjectNotFoundError(`id: ${project_id}`);
		}
		await this.cityService.readOne(dto.city_id);
		const updatedProject = this.projectsRepository.merge(project, dto);
		await this.projectsRepository.save(updatedProject);
		return updatedProject;
	}

	async delete(id: number): Promise<ProjectEntity> {
		const project = await this.projectsRepository.findOne({
			where: { id },
		});
		if (!project) {
			throw new ProjectNotFoundError(`id: ${id}`);
		}
		await this.projectsRepository.remove(project);
		return project;
	}

	async readOne(id: number, select?: FindOptionsSelect<ProjectEntity>) {
		const foundProject = await this.projectsRepository.findOne({
			select: select ? { id: true, ...select } : undefined, // NOTE: If id is not provided it returns null
			where: { id: id },
		});
		if (!foundProject) {
			throw new ProjectNotFoundError(`id: ${id}`);
		}
		return foundProject;
	}

	async checkExists(id: number): Promise<void> {
		const foundClient = await this.projectsRepository.existsBy({ id: id });
		if (!foundClient) {
			throw new ProjectNotFoundError(`id: ${id}`);
		}
	}

	async readOneByExtId(
		ext_id: string,
		select?: FindOptionsSelect<ProjectEntity>,
	) {
		const client = await this.projectsRepository.findOne({
			select: select,
			where: { ext_id: ext_id },
		});
		if (!client) {
			throw new ProjectNotFoundError(`ext_id: ${ext_id}`);
		}
		return client;
	}
}
