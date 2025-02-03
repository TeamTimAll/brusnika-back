import { Injectable } from "@nestjs/common";
import { In } from "typeorm";

import { ProjectService } from "../../projects/projects.service";
import { CityService } from "../../cities/cities.service";
import { UserEntity } from "../../user/user.entity";
import { UserService } from "../../user/user.service";
import { NotificationType } from "../../notification/notification.entity";
import { NotificationService } from "../../notification/notification.service";

import { ProjectDto, ProjectsDto } from "./dto";

@Injectable()
export class ProjectQueueService {
	constructor(
		private readonly projectService: ProjectService,
		private readonly cityService: CityService,
		private readonly notificationService: NotificationService,
		private readonly userService: UserService,
	) {}

	async createOrUpdateProject(project: ProjectDto) {
		const city = await this.cityService.readOneByExtId(
			project.city_ext_id,
			{ id: true },
		);

		const result = await this.projectService.repository
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
					"name",
					"photo",
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
				["ext_id"]  // Поля для проверки уникальности
			)
			.returning(["id", "created_at", "updated_at"]) // Возвращаем ключевые поля
			.execute();

		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const rawArray: Array<{ id: number; created_at: string; updated_at: string; name: string }> = result.raw;

		if (rawArray.length > 0) {
			const rawResult = rawArray[0];

			if (rawResult.created_at === rawResult.updated_at) {
				const userTokens = (await this.userService.repository.find({
					select: { id: true, firebase_token: true },
					where: {
						role: In(["AGENT", "HEAD_OF_AGENCY"]),
					},
				})) as Array<Pick<UserEntity, "id" | "firebase_token">>;

				await this.notificationService.sendToUsers(userTokens, {
					title: "Проекты",
					description: `Новый проект "${rawResult.name}" теперь доступен`,
					type: NotificationType.PROJECT_ASSIGNABLE,
					object_id: rawResult.id,
				});
			}
		}
	}

	async createProjects({ data: projects }: ProjectsDto) {
		for await (const project of projects) {
			await this.createOrUpdateProject(project);
		}
	}
}
