import { DataSource, QueryBuilder } from "typeorm";

// import { CityEntity } from "../../modules/cities/cities.entity";
import { ProjectEntity } from "../../modules/projects/project.entity";

// function findCityId(cities: CityEntity[], name: string) {
// 	return cities.find((e) => e.name === name)?.id;
// }

// type IProjectEntity = Omit<
// 	ProjectEntity,
// 	"id" | "ext_id" | "city" | "created_at" | "updated_at" | "is_active"
// >;

// export async function up(
// 	query: QueryBuilder<object>,
// 	cities: CityEntity[],
// ): Promise<ProjectEntity[]> {
// 	const projects: IProjectEntity[] = [
// 		{
// 			city_id: findCityId(cities, "Москва"),
// 			name: "Москва Проект",
// 			description:
// 				"хороший проект. В нем может находиться несколько человек",
// 			end_date: new Date(),
// 			location: "Пресненская набережная, Москва",
// 			long: "37.6173",
// 			lat: "55.7558",
// 			company_link: "brusnika.ru/flat/gorka",
// 			building_link: "brusnika.ru/flat/gorka/1",
// 			project_link: "brusnika.ru/flat/gorka",
// 			photo: "project_default_image.jpg",
// 			photos: ["project_default_image.jpg", "project_default_image.jpg"],
// 			price: 100000,
// 		},
// 		{
// 			city_id: findCityId(cities, "Тюмень"),
// 			name: "Тюмень Проект",
// 			description:
// 				"хороший проект. В нем может находиться несколько человек",
// 			end_date: new Date(),
// 			location: "Тюмень, Тюменская область",
// 			long: "65.5619",
// 			lat: "57.1553",
// 			company_link: "brusnika.ru/flat/gorka",
// 			building_link: "brusnika.ru/flat/gorka/1",
// 			project_link: "brusnika.ru/flat/gorka",
// 			photo: "project_default_image.jpg",
// 			photos: ["project_default_image.jpg", "project_default_image.jpg"],
// 			price: 200000,
// 		},
// 		{
// 			city_id: findCityId(cities, "Новосибирск"),
// 			name: "Новосибирск Проект",
// 			description:
// 				"хороший проект. В нем может находиться несколько человек",
// 			end_date: new Date(),
// 			location: "Пресненская набережная, Новосибирск",
// 			long: "82.8964",
// 			lat: "54.9833",
// 			company_link: "brusnika.ru/flat/gorka",
// 			building_link: "brusnika.ru/flat/gorka/1",
// 			project_link: "brusnika.ru/flat/gorka",
// 			photo: "project_default_image.jpg",
// 			photos: ["project_default_image.jpg", "project_default_image.jpg"],
// 			price: 150000,
// 		},
// 		{
// 			city_id: findCityId(cities, "Екатеринбург"),
// 			name: "Екатеринбург Проект",
// 			description:
// 				"хороший проект. В нем может находиться несколько человек",
// 			company_link: "brusnika.ru/flat/gorka",
// 			building_link: "brusnika.ru/flat/gorka/1",
// 			project_link: "brusnika.ru/flat/gorka",
// 			photo: "project_default_image.jpg",
// 			photos: ["project_default_image.jpg", "project_default_image.jpg"],
// 			price: 120000,
// 			location: "Пресненская набережная, Екатеринбург",
// 			long: "60.6454",
// 			lat: "56.8431",
// 			end_date: new Date(),
// 		},
// 		{
// 			city_id: findCityId(cities, "Сургут"),
// 			name: "Сургут Проект",
// 			description:
// 				"хороший проект. В нем может находиться несколько человек",
// 			company_link: "brusnika.ru/flat/gorka",
// 			building_link: "brusnika.ru/flat/gorka/1",
// 			project_link: "brusnika.ru/flat/gorka",
// 			photo: "project_default_image.jpg",
// 			photos: ["project_default_image.jpg", "project_default_image.jpg"],
// 			price: 100000,
// 			location: "Пресненская набережная, Сургут",
// 			long: "73.393032",
// 			lat: "61.241778",
// 			end_date: new Date(),
// 		},
// 		{
// 			city_id: findCityId(cities, "Курган"),
// 			name: "Курган Проект",
// 			description:
// 				"хороший проект. В нем может находиться несколько человек",
// 			company_link: "brusnika.ru/flat/gorka",
// 			building_link: "brusnika.ru/flat/gorka/1",
// 			project_link: "brusnika.ru/flat/gorka",
// 			photo: "project_default_image.jpg",
// 			photos: ["project_default_image.jpg", "project_default_image.jpg"],
// 			price: 90000,
// 			location: "Пресненская набережная, Курган",
// 			long: "65.341118",
// 			lat: "55.441004",
// 			end_date: new Date(),
// 		},
// 		{
// 			city_id: findCityId(cities, "Омск"),
// 			name: "Омск Проект",
// 			description:
// 				"хороший проект. В нем может находиться несколько человек",
// 			company_link: "brusnika.ru/flat/gorka",
// 			building_link: "brusnika.ru/flat/gorka/1",
// 			project_link: "brusnika.ru/flat/gorka",
// 			photo: "project_default_image.jpg",
// 			photos: ["project_default_image.jpg", "project_default_image.jpg"],
// 			price: 400000,
// 			location: "Пресненская набережная, Омск",
// 			long: "73.3645",
// 			lat: "54.9914",
// 			end_date: new Date(),
// 		},
// 	];

// 	const { generatedMaps } = await query
// 		.insert()
// 		.into(ProjectEntity)
// 		.values(projects)
// 		.returning("*")
// 		.execute();
// 	return generatedMaps as ProjectEntity[];
// }

export async function up(
	query: QueryBuilder<object>,
): Promise<ProjectEntity[]> {
	const project = await query
		.select("project")
		.from(ProjectEntity, "project")
		.getMany();

	return project;
}

export async function down(dataSource: DataSource) {
	const tableName = dataSource.getMetadata(ProjectEntity).tableName;
	await dataSource.query(`TRUNCATE ${tableName} RESTART IDENTITY CASCADE;`);
}
