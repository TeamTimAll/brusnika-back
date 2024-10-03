import { QueryBuilder } from "typeorm";

import { CityEntity } from "../../modules/cities/cities.entity";
import { ProjectEntity } from "../../modules/projects/project.entity";

function findCityId(cities: CityEntity[], name: string) {
	return cities.find((e) => e.name === name)?.id;
}

type IProjectEntity = Omit<
	ProjectEntity,
	"id" | "city" | "created_at" | "updated_at" | "is_active"
>;

export async function up(
	query: QueryBuilder<object>,
	cities: CityEntity[],
): Promise<ProjectEntity[]> {
	const projects: IProjectEntity[] = [
		{
			city_id: findCityId(cities, "Москва"),
			name: "Москва Проект",
			detailed_description: "хороший проект. В нем может находиться несколько человек",
			brief_description: "хороший проект. В нем может находиться несколько человек",
			photo: "project_default_image.jpg",
			price: 100000,
			location: "Пресненская набережная, Москва",
			long: "37.6173",
			lat: "55.7558",
			link: "",
			end_date: new Date(),
			description: ""
		},
		{
			city_id: findCityId(cities, "Тюмень"),
			name: "Тюмень Проект",
			detailed_description: "хороший проект. В нем может находиться несколько человек",
			brief_description: "хороший проект. В нем может находиться несколько человек",
			photo: "project_default_image.jpg",
			price: 200000,
			location: "Тюмень, Тюменская область",
			long: "65.5619",
			lat: "57.1553",
			link: "",
			end_date: new Date(),
			description: ""
		},
		{
			city_id: findCityId(cities, "Новосибирск"),
			name: "Новосибирск Проект",
			detailed_description: "хороший проект. В нем может находиться несколько человек",
			brief_description: "хороший проект. В нем может находиться несколько человек",
			photo: "project_default_image.jpg",
			price: 150000,
			location: "Пресненская набережная, Новосибирск",
			long: "82.8964",
			lat: "54.9833",
			link: "",
			end_date: new Date(),
			description: ""
		},
		{
			city_id: findCityId(cities, "Екатеринбург"),
			name: "Екатеринбург Проект",
			detailed_description: "хороший проект. В нем может находиться несколько человек",
			brief_description: "хороший проект. В нем может находиться несколько человек",
			photo: "project_default_image.jpg",
			price: 120000,
			location: "Пресненская набережная, Екатеринбург",
			long: "60.6454",
			lat: "56.8431",
			link: "",
			end_date: new Date(),
			description: ""
		},
		{
			city_id: findCityId(cities, "Сургут"),
			name: "Сургут Проект",
			detailed_description: "хороший проект. В нем может находиться несколько человек",
			brief_description: "хороший проект. В нем может находиться несколько человек",
			photo: "project_default_image.jpg",
			price: 100000,
			location: "Пресненская набережная, Сургут",
			long: "73.393032",
			lat: "61.241778",
			link: "",
			end_date: new Date(),
			description: ""
		},
		{
			city_id: findCityId(cities, "Курган"),
			name: "Курган Проект",
			detailed_description: "хороший проект. В нем может находиться несколько человек",
			brief_description: "хороший проект. В нем может находиться несколько человек",
			photo: "project_default_image.jpg",
			price: 90000,
			location: "Пресненская набережная, Курган",
			long: "65.341118",
			lat: "55.441004",
			link: "",
			end_date: new Date(),
			description: ""
		},
		{
			city_id: findCityId(cities, "Омск"),
			name: "Омск Проект",
			detailed_description: "хороший проект. В нем может находиться несколько человек",
			brief_description: "хороший проект. В нем может находиться несколько человек",
			photo: "project_default_image.jpg",
			price: 400000,
			location: "Пресненская набережная, Омск",
			long: "73.3645",
			lat: "54.9914",
			link: "",
			end_date: new Date(),
			description: ""
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
