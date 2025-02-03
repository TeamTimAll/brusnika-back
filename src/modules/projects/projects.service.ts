import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
	Brackets,
	FindOptionsRelations,
	FindOptionsSelect,
	// In,
	Repository,
} from "typeorm";

import { PickBySelect } from "interfaces/pick_by_select";

import { BaseDto } from "../../common/base/base_dto";
import { CityService } from "../cities/cities.service";
import { PremiseEntity, PremisesType } from "../premises/premises.entity";
import { BuildingsService } from "../buildings/buildings.service";
// import { UserEntity } from "../user/user.entity";
// import { UserService } from "../user/user.service";
// import { NotificationType } from "../notification/notification.entity";
// import { NotificationService } from "../notification/notification.service";

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
	photos: ProjectEntity["photos"];
	photo: ProjectEntity["photo"];
	name: ProjectEntity["name"];
	description: ProjectEntity["description"];
	end_date: ProjectEntity["end_date"];
	location: ProjectEntity["location"];
	long: ProjectEntity["long"];
	lat: ProjectEntity["lat"];
	company_link: ProjectEntity["company_link"];
	price: ProjectEntity["price"];
	buildings: ProjectEntity["buildings"];
	building_link: ProjectEntity["building_link"];
	project_link: ProjectEntity["project_link"];
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
		@Inject(forwardRef(() => BuildingsService))
		private buildingService: BuildingsService,
		// private readonly notificationService: NotificationService,
		// private readonly userService: UserService,
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
							text: `${dto.text}%`,
						})
						.orWhere("p.description ILIKE :text", {
							text: `${dto.text}%`,
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
				"project.photos AS photos",
				"project.photo AS photo",
				"project.name AS name",
				"project.description AS description",
				"project.end_date AS end_date",
				"project.location AS location",
				"project.long AS long",
				"project.lat AS lat",
				"project.company_link AS company_link",
				"project.building_link AS building_link",
				"project.project_link AS project_link",
				`JSON_AGG(DISTINCT JSON_BUILD_OBJECT(
	      	'id', building.id,
	      	'name', building.name,
	      	'address', building.address,
	      	'number_of_floors', building.number_of_floors,
					'object_id', building.object_id
	  		)::TEXT) AS buildings`,
				"project.price AS price",
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

		projects.forEach((project) => {
			if (project.buildings) {
				project.buildings = project.buildings.map((building) =>
					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					JSON.parse(building as unknown as string),
				);
			}
		});

		const validTypes = Object.values(PremisesType);

		const formattedResult = projects.reduce<GetAllProjectRaw[]>(
			(acc, row) => {
				const projectId = row.id;

				let project = acc.find((p) => p.id === projectId);
				if (typeof project === "undefined") {
					project = {
						id: row.id,
						photos: row.photos,
						photo: row.photo,
						name: row.name,
						description: row.description,
						end_date: row.end_date,
						location: row.location,
						long: row.long,
						lat: row.lat,
						company_link: row.company_link,
						price: row.price,
						building_link: row.building_link,
						project_link: row.project_link,
						premise_count: row.premise_count,
						premise_type: row.premise_type,
						buildings: row.buildings,
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
		dto.price = 100000;

		await this.cityService.readOne(dto.city_id);
		const newProject = this.projectsRepository.create({
			photos: dto.photos,
			photo: dto.photo,
			name: dto.name,
			description: dto.description,
			location: dto.location,
			long: dto.long,
			lat: dto.lat,
			end_date: dto.end_date,
			company_link: dto.company_link,
			building_link: dto.building_link,
			project_link: dto.project_link,
			city_id: dto.city_id,
			price: dto.price,
		});

		const project = await this.projectsRepository.save(newProject);

		const newBuilding = dto.buildings.map((b) => {
			b["project_id"] = project.id;

			return b;
		});

		await this.buildingService.createMany(newBuilding);

		/*const userTokens = (await this.userService.repository.find({
			select: { id: true, firebase_token: true },
			where: {
				role: In(["AGENT", "HEAD_OF_AGENCY"]),
			}
		})) as Array<Pick<UserEntity, "id" | "firebase_token">>;

		await this.notificationService.sendToUsers(userTokens, {
			title: "Проекты",
			description: `Новый проект "${project.name}" теперь доступен`,
			type: NotificationType.PROJECT_ASSIGNABLE,
			object_id: project.id,
		});*/

		return project;
	}

	async getOneProject(id: number): Promise<ProjectEntity | null> {
		return await this.projectsRepository.findOne({
			where: { id },
			relations: {
				buildings: true,
			},
		});
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
		await this.cityService.checkExsits(dto.city_id);

		const project = await this.projectsRepository.findOne({
			where: { id: project_id },
		});

		if (!project) {
			throw new ProjectNotFoundError(`id: ${project_id}`);
		}

		const { buildings, ...resurs } = dto;

		const newProject = this.projectsRepository.create({
			...resurs,
			id: project.id,
		});

		await this.projectsRepository.save(newProject);

		if (dto.buildings && dto.buildings.length) {
			await this.buildingService.updateAll(dto.buildings);
		}

		return project;
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

	async readOne(
		id: number,
		select?: FindOptionsSelect<ProjectEntity>,
		relations?: FindOptionsRelations<ProjectEntity>,
	) {
		const foundProject = await this.projectsRepository.findOne({
			select: select ? { id: true, ...select } : undefined, // NOTE: If id is not provided it returns null
			where: { id: id },
			relations: relations ? { ...relations } : undefined,
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

	async readOneByExtId<T extends FindOptionsSelect<ProjectEntity>>(
		ext_id: string,
		select?: T,
	): Promise<PickBySelect<ProjectEntity, T>> {
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
