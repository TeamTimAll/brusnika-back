import { QueryBuilder } from "typeorm";

import { WithOutToDto } from "types";

import { BuildingsEntity } from "../../modules/buildings/buildings.entity";
import { ProjectEntity } from "../../modules/projects/project.entity";

function findProjectId(buildings: ProjectEntity[], name: string) {
	return buildings.find((e) => e.name === name)?.id ?? "";
}

export async function up(query: QueryBuilder<object>) {
	const projects = await query
		.select(["c.id AS id", "c.name AS name"])
		.from(ProjectEntity, "c")
		.getRawMany<ProjectEntity>();

	const buildings: WithOutToDto<
		Omit<
			BuildingsEntity,
			| "id"
			| "project"
			| "total_apartment"
			| "total_vacant_apartment"
			| "createdAt"
			| "updatedAt"
		>
	>[] = [
		{
			project_id: findProjectId(projects, "Москва Проект"),
			name: "Дом 1",
			address: "",
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
			name: "Дом 2",
			address: "",
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
			name: "Дом 3",
			address: "",
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
			name: "Дом 1",
			address: "",
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
			name: "Дом 2",
			address: "",
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
			name: "Дом 3",
			address: "",
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
			name: "Дом 1",
			address: "",
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
			name: "Дом 2",
			address: "",
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
			name: "Дом 3",
			address: "",
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
			name: "Дом 1",
			address: "",
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
			name: "Дом 2",
			address: "",
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
			name: "Дом 3",
			address: "",
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
			name: "Дом 1",
			address: "",
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
			name: "Дом 2",
			address: "",
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
			name: "Дом 3",
			address: "",
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
			name: "Дом 1",
			address: "",
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
			name: "Дом 2",
			address: "",
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
			name: "Дом 3",
			address: "",
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
			name: "Дом 1",
			address: "",
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
			name: "Дом 2",
			address: "",
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
			name: "Дом 3",
			address: "",
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
