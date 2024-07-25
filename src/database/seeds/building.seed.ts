import { QueryBuilder } from "typeorm";

import { BuildingsEntity } from "../../modules/buildings/buildings.entity";
import { ProjectEntity } from "../../modules/projects/project.entity";

function findProjectId(buildings: ProjectEntity[], name: string) {
	return buildings.find((e) => e.name === name)?.id ?? 0;
}

export async function up(query: QueryBuilder<object>) {
	const projects = await query
		.select(["c.id AS id", "c.name AS name"])
		.from(ProjectEntity, "c")
		.getRawMany<ProjectEntity>();

	const buildings: Omit<
		BuildingsEntity,
		| "id"
		| "project"
		| "total_apartment"
		| "total_vacant_apartment"
		| "createdAt"
		| "updatedAt"
	>[] = [
		{
			project_id: findProjectId(projects, "Москва Проект"),
			name: "Москва Дом 1",
			address: "Москва, Москва",
			number_of_floors: 9,
			photos: [
				"building_default_image.jpg",
				"building_default_image.jpg",
			],
			total_storage: 3,
			total_vacant_storage: 4,
			total_parking_space: 5,
			total_vacant_parking_space: 23,
			total_commercial: 3,
			total_vacant_commercial: 12,
		},
		{
			project_id: findProjectId(projects, "Москва Проект"),
			name: "Москва Дом 2",
			address: "Москва, Москва",
			number_of_floors: 9,
			photos: [
				"building_default_image.jpg",
				"building_default_image.jpg",
			],
			total_storage: 3,
			total_vacant_storage: 4,
			total_parking_space: 5,
			total_vacant_parking_space: 23,
			total_commercial: 3,
			total_vacant_commercial: 12,
		},
		{
			project_id: findProjectId(projects, "Москва Проект"),
			name: "Москва Дом 3",
			address: "Москва, Москва",
			number_of_floors: 9,
			photos: [
				"building_default_image.jpg",
				"building_default_image.jpg",
			],
			total_storage: 3,
			total_vacant_storage: 4,
			total_parking_space: 5,
			total_vacant_parking_space: 23,
			total_commercial: 3,
			total_vacant_commercial: 12,
		},

		{
			project_id: findProjectId(projects, "Тюмень Проект"),
			name: "Тюмень Дом 1",
			address: "Тюмень, Тюмень",
			number_of_floors: 9,
			photos: [
				"building_default_image.jpg",
				"building_default_image.jpg",
			],
			total_storage: 3,
			total_vacant_storage: 4,
			total_parking_space: 5,
			total_vacant_parking_space: 23,
			total_commercial: 3,
			total_vacant_commercial: 12,
		},
		{
			project_id: findProjectId(projects, "Тюмень Проект"),
			name: "Тюмень Дом 2",
			address: "Тюмень, Тюмень",
			number_of_floors: 9,
			photos: [
				"building_default_image.jpg",
				"building_default_image.jpg",
			],
			total_storage: 3,
			total_vacant_storage: 4,
			total_parking_space: 5,
			total_vacant_parking_space: 23,
			total_commercial: 3,
			total_vacant_commercial: 12,
		},
		{
			project_id: findProjectId(projects, "Тюмень Проект"),
			name: "Тюмень Дом 3",
			address: "Тюмень, Тюмень",
			number_of_floors: 9,
			photos: [
				"building_default_image.jpg",
				"building_default_image.jpg",
			],
			total_storage: 3,
			total_vacant_storage: 4,
			total_parking_space: 5,
			total_vacant_parking_space: 23,
			total_commercial: 3,
			total_vacant_commercial: 12,
		},

		{
			project_id: findProjectId(projects, "Новосибирск Проект"),
			name: "Новосибирск Дом 1",
			address: "Новосибирск, Новосибирск",
			number_of_floors: 9,
			photos: [
				"building_default_image.jpg",
				"building_default_image.jpg",
			],
			total_storage: 3,
			total_vacant_storage: 4,
			total_parking_space: 5,
			total_vacant_parking_space: 23,
			total_commercial: 3,
			total_vacant_commercial: 12,
		},
		{
			project_id: findProjectId(projects, "Новосибирск Проект"),
			name: "Новосибирск Дом 2",
			address: "Новосибирск, Новосибирск",
			number_of_floors: 9,
			photos: [
				"building_default_image.jpg",
				"building_default_image.jpg",
			],
			total_storage: 3,
			total_vacant_storage: 4,
			total_parking_space: 5,
			total_vacant_parking_space: 23,
			total_commercial: 3,
			total_vacant_commercial: 12,
		},
		{
			project_id: findProjectId(projects, "Новосибирск Проект"),
			name: "Новосибирск Дом 3",
			address: "Новосибирск, Новосибирск",
			number_of_floors: 9,
			photos: [
				"building_default_image.jpg",
				"building_default_image.jpg",
			],
			total_storage: 3,
			total_vacant_storage: 4,
			total_parking_space: 5,
			total_vacant_parking_space: 23,
			total_commercial: 3,
			total_vacant_commercial: 12,
		},

		{
			project_id: findProjectId(projects, "Екатеринбург Проект"),
			name: "Екатеринбург Дом 1",
			address: "Екатеринбург, Екатеринбург",
			number_of_floors: 9,
			photos: [
				"building_default_image.jpg",
				"building_default_image.jpg",
			],
			total_storage: 3,
			total_vacant_storage: 4,
			total_parking_space: 5,
			total_vacant_parking_space: 23,
			total_commercial: 3,
			total_vacant_commercial: 12,
		},
		{
			project_id: findProjectId(projects, "Екатеринбург Проект"),
			name: "Екатеринбург Дом 2",
			address: "Екатеринбург, Екатеринбург",
			number_of_floors: 9,
			photos: [
				"building_default_image.jpg",
				"building_default_image.jpg",
			],
			total_storage: 3,
			total_vacant_storage: 4,
			total_parking_space: 5,
			total_vacant_parking_space: 23,
			total_commercial: 3,
			total_vacant_commercial: 12,
		},
		{
			project_id: findProjectId(projects, "Екатеринбург Проект"),
			name: "Екатеринбург Дом 3",
			address: "Екатеринбург, Екатеринбург",
			number_of_floors: 9,
			photos: [
				"building_default_image.jpg",
				"building_default_image.jpg",
			],
			total_storage: 3,
			total_vacant_storage: 4,
			total_parking_space: 5,
			total_vacant_parking_space: 23,
			total_commercial: 3,
			total_vacant_commercial: 12,
		},

		{
			project_id: findProjectId(projects, "Сургут Проект"),
			name: "Сургут Дом 1",
			address: "Сургут, Сургут",
			number_of_floors: 9,
			photos: [
				"building_default_image.jpg",
				"building_default_image.jpg",
			],
			total_storage: 3,
			total_vacant_storage: 4,
			total_parking_space: 5,
			total_vacant_parking_space: 23,
			total_commercial: 3,
			total_vacant_commercial: 12,
		},
		{
			project_id: findProjectId(projects, "Сургут Проект"),
			name: "Сургут Дом 2",
			address: "Сургут, Сургут",
			number_of_floors: 9,
			photos: [
				"building_default_image.jpg",
				"building_default_image.jpg",
			],
			total_storage: 3,
			total_vacant_storage: 4,
			total_parking_space: 5,
			total_vacant_parking_space: 23,
			total_commercial: 3,
			total_vacant_commercial: 12,
		},
		{
			project_id: findProjectId(projects, "Сургут Проект"),
			name: "Сургут Дом 3",
			address: "Сургут, Сургут",
			number_of_floors: 9,
			photos: [
				"building_default_image.jpg",
				"building_default_image.jpg",
			],
			total_storage: 3,
			total_vacant_storage: 4,
			total_parking_space: 5,
			total_vacant_parking_space: 23,
			total_commercial: 3,
			total_vacant_commercial: 12,
		},

		{
			project_id: findProjectId(projects, "Курган Проект"),
			name: "Курган Дом 1",
			address: "Курган, Курган",
			number_of_floors: 9,
			photos: [
				"building_default_image.jpg",
				"building_default_image.jpg",
			],
			total_storage: 3,
			total_vacant_storage: 4,
			total_parking_space: 5,
			total_vacant_parking_space: 23,
			total_commercial: 3,
			total_vacant_commercial: 12,
		},
		{
			project_id: findProjectId(projects, "Курган Проект"),
			name: "Курган Дом 2",
			address: "Курган, Курган",
			number_of_floors: 9,
			photos: [
				"building_default_image.jpg",
				"building_default_image.jpg",
			],
			total_storage: 3,
			total_vacant_storage: 4,
			total_parking_space: 5,
			total_vacant_parking_space: 23,
			total_commercial: 3,
			total_vacant_commercial: 12,
		},
		{
			project_id: findProjectId(projects, "Курган Проект"),
			name: "Курган Дом 3",
			address: "Курган, Курган",
			number_of_floors: 9,
			photos: [
				"building_default_image.jpg",
				"building_default_image.jpg",
			],
			total_storage: 3,
			total_vacant_storage: 4,
			total_parking_space: 5,
			total_vacant_parking_space: 23,
			total_commercial: 3,
			total_vacant_commercial: 12,
		},

		{
			project_id: findProjectId(projects, "Омск Проект"),
			name: "Омск Дом 1",
			address: "Омск, Омск",
			number_of_floors: 9,
			photos: [
				"building_default_image.jpg",
				"building_default_image.jpg",
			],
			total_storage: 3,
			total_vacant_storage: 4,
			total_parking_space: 5,
			total_vacant_parking_space: 23,
			total_commercial: 3,
			total_vacant_commercial: 12,
		},
		{
			project_id: findProjectId(projects, "Омск Проект"),
			name: "Омск Дом 2",
			address: "Омск, Омск",
			number_of_floors: 9,
			photos: [
				"building_default_image.jpg",
				"building_default_image.jpg",
			],
			total_storage: 3,
			total_vacant_storage: 4,
			total_parking_space: 5,
			total_vacant_parking_space: 23,
			total_commercial: 3,
			total_vacant_commercial: 12,
		},
		{
			project_id: findProjectId(projects, "Омск Проект"),
			name: "Омск Дом 3",
			address: "Омск, Омск",
			number_of_floors: 9,
			photos: [
				"building_default_image.jpg",
				"building_default_image.jpg",
			],
			total_storage: 3,
			total_vacant_storage: 4,
			total_parking_space: 5,
			total_vacant_parking_space: 23,
			total_commercial: 3,
			total_vacant_commercial: 12,
		},
	];

	await query.insert().into(BuildingsEntity).values(buildings).execute();
}

export async function down(query: QueryBuilder<object>) {
	await query.delete().from(BuildingsEntity).execute();
}
