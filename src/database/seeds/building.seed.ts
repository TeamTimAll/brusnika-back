import { DataSource, QueryBuilder } from "typeorm";

import { BuildingEntity } from "../../modules/buildings/buildings.entity";
// import { ProjectEntity } from "../../modules/projects/project.entity";

// function findProjectId(buildings: ProjectEntity[], name: string) {
// 	return buildings.find((e) => e.name === name)?.id ?? 0;
// }

// type IBuildingEntity = Omit<
// 	BuildingEntity,
// 	"id" | "ext_id" | "project" | "created_at" | "updated_at" | "is_active"
// >;

// export async function up(
// 	query: QueryBuilder<object>,
// 	projects: ProjectEntity[],
// ): Promise<BuildingEntity[]> {
// 	const buildings: IBuildingEntity[] = [
// 		{
// 			project_id: findProjectId(projects, "Москва Проект"),
// 			name: "Москва Дом 1",
// 			address: "Москва, Москва",
// 			number_of_floors: 9,
// 			photos: [
// 				"building_default_image.jpg",
// 				"building_default_image.jpg",
// 			],
// 		},
// 		{
// 			project_id: findProjectId(projects, "Москва Проект"),
// 			name: "Москва Дом 2",
// 			address: "Москва, Москва",
// 			number_of_floors: 9,
// 			photos: [
// 				"building_default_image.jpg",
// 				"building_default_image.jpg",
// 			],
// 		},
// 		{
// 			project_id: findProjectId(projects, "Москва Проект"),
// 			name: "Москва Дом 3",
// 			address: "Москва, Москва",
// 			number_of_floors: 9,
// 			photos: [
// 				"building_default_image.jpg",
// 				"building_default_image.jpg",
// 			],
// 		},

// 		{
// 			project_id: findProjectId(projects, "Тюмень Проект"),
// 			name: "Тюмень Дом 1",
// 			address: "Тюмень, Тюмень",
// 			number_of_floors: 9,
// 			photos: [
// 				"building_default_image.jpg",
// 				"building_default_image.jpg",
// 			],
// 		},
// 		{
// 			project_id: findProjectId(projects, "Тюмень Проект"),
// 			name: "Тюмень Дом 2",
// 			address: "Тюмень, Тюмень",
// 			number_of_floors: 9,
// 			photos: [
// 				"building_default_image.jpg",
// 				"building_default_image.jpg",
// 			],
// 		},
// 		{
// 			project_id: findProjectId(projects, "Тюмень Проект"),
// 			name: "Тюмень Дом 3",
// 			address: "Тюмень, Тюмень",
// 			number_of_floors: 9,
// 			photos: [
// 				"building_default_image.jpg",
// 				"building_default_image.jpg",
// 			],
// 		},

// 		{
// 			project_id: findProjectId(projects, "Новосибирск Проект"),
// 			name: "Новосибирск Дом 1",
// 			address: "Новосибирск, Новосибирск",
// 			number_of_floors: 9,
// 			photos: [
// 				"building_default_image.jpg",
// 				"building_default_image.jpg",
// 			],
// 		},
// 		{
// 			project_id: findProjectId(projects, "Новосибирск Проект"),
// 			name: "Новосибирск Дом 2",
// 			address: "Новосибирск, Новосибирск",
// 			number_of_floors: 9,
// 			photos: [
// 				"building_default_image.jpg",
// 				"building_default_image.jpg",
// 			],
// 		},
// 		{
// 			project_id: findProjectId(projects, "Новосибирск Проект"),
// 			name: "Новосибирск Дом 3",
// 			address: "Новосибирск, Новосибирск",
// 			number_of_floors: 9,
// 			photos: [
// 				"building_default_image.jpg",
// 				"building_default_image.jpg",
// 			],
// 		},

// 		{
// 			project_id: findProjectId(projects, "Екатеринбург Проект"),
// 			name: "Екатеринбург Дом 1",
// 			address: "Екатеринбург, Екатеринбург",
// 			number_of_floors: 9,
// 			photos: [
// 				"building_default_image.jpg",
// 				"building_default_image.jpg",
// 			],
// 		},
// 		{
// 			project_id: findProjectId(projects, "Екатеринбург Проект"),
// 			name: "Екатеринбург Дом 2",
// 			address: "Екатеринбург, Екатеринбург",
// 			number_of_floors: 9,
// 			photos: [
// 				"building_default_image.jpg",
// 				"building_default_image.jpg",
// 			],
// 		},
// 		{
// 			project_id: findProjectId(projects, "Екатеринбург Проект"),
// 			name: "Екатеринбург Дом 3",
// 			address: "Екатеринбург, Екатеринбург",
// 			number_of_floors: 9,
// 			photos: [
// 				"building_default_image.jpg",
// 				"building_default_image.jpg",
// 			],
// 		},

// 		{
// 			project_id: findProjectId(projects, "Сургут Проект"),
// 			name: "Сургут Дом 1",
// 			address: "Сургут, Сургут",
// 			number_of_floors: 9,
// 			photos: [
// 				"building_default_image.jpg",
// 				"building_default_image.jpg",
// 			],
// 		},
// 		{
// 			project_id: findProjectId(projects, "Сургут Проект"),
// 			name: "Сургут Дом 2",
// 			address: "Сургут, Сургут",
// 			number_of_floors: 9,
// 			photos: [
// 				"building_default_image.jpg",
// 				"building_default_image.jpg",
// 			],
// 		},
// 		{
// 			project_id: findProjectId(projects, "Сургут Проект"),
// 			name: "Сургут Дом 3",
// 			address: "Сургут, Сургут",
// 			number_of_floors: 9,
// 			photos: [
// 				"building_default_image.jpg",
// 				"building_default_image.jpg",
// 			],
// 		},

// 		{
// 			project_id: findProjectId(projects, "Курган Проект"),
// 			name: "Курган Дом 1",
// 			address: "Курган, Курган",
// 			number_of_floors: 9,
// 			photos: [
// 				"building_default_image.jpg",
// 				"building_default_image.jpg",
// 			],
// 		},
// 		{
// 			project_id: findProjectId(projects, "Курган Проект"),
// 			name: "Курган Дом 2",
// 			address: "Курган, Курган",
// 			number_of_floors: 9,
// 			photos: [
// 				"building_default_image.jpg",
// 				"building_default_image.jpg",
// 			],
// 		},
// 		{
// 			project_id: findProjectId(projects, "Курган Проект"),
// 			name: "Курган Дом 3",
// 			address: "Курган, Курган",
// 			number_of_floors: 9,
// 			photos: [
// 				"building_default_image.jpg",
// 				"building_default_image.jpg",
// 			],
// 		},

// 		{
// 			project_id: findProjectId(projects, "Омск Проект"),
// 			name: "Омск Дом 1",
// 			address: "Омск, Омск",
// 			number_of_floors: 9,
// 			photos: [
// 				"building_default_image.jpg",
// 				"building_default_image.jpg",
// 			],
// 		},
// 		{
// 			project_id: findProjectId(projects, "Омск Проект"),
// 			name: "Омск Дом 2",
// 			address: "Омск, Омск",
// 			number_of_floors: 9,
// 			photos: [
// 				"building_default_image.jpg",
// 				"building_default_image.jpg",
// 			],
// 		},
// 		{
// 			project_id: findProjectId(projects, "Омск Проект"),
// 			name: "Омск Дом 3",
// 			address: "Омск, Омск",
// 			number_of_floors: 9,
// 			photos: [
// 				"building_default_image.jpg",
// 				"building_default_image.jpg",
// 			],
// 		},
// 	];

// 	const res = await query
// 		.insert()
// 		.into(BuildingEntity)
// 		.values(buildings)
// 		.returning("*")
// 		.execute();
// 	return res.generatedMaps as BuildingEntity[];
// }

export async function up(
	query: QueryBuilder<object>,
): Promise<BuildingEntity[]> {
	const building = await query
		.select("building")
		.from(BuildingEntity, "building")
		.getMany();

	return building;
}

export async function down(dataSource: DataSource) {
	const tableName = dataSource.getMetadata(BuildingEntity).tableName;
	await dataSource.query(`TRUNCATE ${tableName} RESTART IDENTITY CASCADE;`);
}
