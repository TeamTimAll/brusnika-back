import { QueryBuilder } from "typeorm";

import { CityEntity } from "../../modules/cities/cities.entity";
import { ProjectEntity } from "../../modules/projects/project.entity";

function findCityId(cities: CityEntity[], name: string) {
	return cities.find((e) => e.name === name)?.id;
}

type IProjectEntity = Omit<
	ProjectEntity,
	"id" | "ext_id" | "city" | "created_at" | "updated_at" | "is_active"
>;

export async function up(
	query: QueryBuilder<object>,
	cities: CityEntity[],
): Promise<ProjectEntity[]> {
	const projects: IProjectEntity[] = [
		{
			city_id: findCityId(cities, "Москва"),
			name: "Москва Проект",
			description:
				"хороший проект. В нем может находиться несколько человек",
			end_date: new Date(),
			address: "Пресненская набережная, Москва",
			company_link: "brusnika.ru/flat/gorka",
			building_link: "brusnika.ru/flat/gorka/1",
			project_link: "brusnika.ru/flat/gorka",
			photo: "project_default_image.jpg",
			price: 100000,
		},
		{
			city_id: findCityId(cities, "Тюмень"),
			name: "Тюмень Проект",
			description:
				"хороший проект. В нем может находиться несколько человек",
			end_date: new Date(),
			address: "Тюмень, Тюменская область",
			company_link: "brusnika.ru/flat/gorka",
			building_link: "brusnika.ru/flat/gorka/1",
			project_link: "brusnika.ru/flat/gorka",
			photo: "project_default_image.jpg",
			price: 200000,
		},
		{
			city_id: findCityId(cities, "Новосибирск"),
			name: "Новосибирск Проект",
			description:
				"хороший проект. В нем может находиться несколько человек",
			end_date: new Date(),
			address: "Пресненская набережная, Новосибирск",
			company_link: "brusnika.ru/flat/gorka",
			building_link: "brusnika.ru/flat/gorka/1",
			project_link: "brusnika.ru/flat/gorka",
			photo: "project_default_image.jpg",
			price: 150000,
		},
		{
			city_id: findCityId(cities, "Екатеринбург"),
			name: "Екатеринбург Проект",
			description:
				"хороший проект. В нем может находиться несколько человек",
			company_link: "brusnika.ru/flat/gorka",
			building_link: "brusnika.ru/flat/gorka/1",
			project_link: "brusnika.ru/flat/gorka",
			photo: "project_default_image.jpg",
			price: 120000,
			address: "Пресненская набережная, Екатеринбург",
			end_date: new Date(),
		},
		{
			city_id: findCityId(cities, "Сургут"),
			name: "Сургут Проект",
			description:
				"хороший проект. В нем может находиться несколько человек",
			company_link: "brusnika.ru/flat/gorka",
			building_link: "brusnika.ru/flat/gorka/1",
			project_link: "brusnika.ru/flat/gorka",
			photo: "project_default_image.jpg",
			price: 100000,
			address: "Пресненская набережная, Сургут",
			end_date: new Date(),
		},
		{
			city_id: findCityId(cities, "Курган"),
			name: "Курган Проект",
			description:
				"хороший проект. В нем может находиться несколько человек",
			company_link: "brusnika.ru/flat/gorka",
			building_link: "brusnika.ru/flat/gorka/1",
			project_link: "brusnika.ru/flat/gorka",
			photo: "project_default_image.jpg",
			price: 90000,
			address: "Пресненская набережная, Курган",
			end_date: new Date(),
		},
		{
			city_id: findCityId(cities, "Омск"),
			name: "Омск Проект",
			description:
				"хороший проект. В нем может находиться несколько человек",
			company_link: "brusnika.ru/flat/gorka",
			building_link: "brusnika.ru/flat/gorka/1",
			project_link: "brusnika.ru/flat/gorka",
			photo: "project_default_image.jpg",
			price: 400000,
			address: "Пресненская набережная, Омск",
			end_date: new Date(),
		},
	];

	const { generatedMaps } = await query
		.insert()
		.into(ProjectEntity)
		.values(projects)
		.returning("*")
		.execute();
	return generatedMaps as ProjectEntity[];
}

export async function down(query: QueryBuilder<object>) {
	await query.delete().from(ProjectEntity).execute();
}
