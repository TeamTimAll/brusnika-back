import { QueryBuilder } from "typeorm";

import { CityEntity } from "../../modules/cities/cities.entity";
import { ProjectEntity } from "../../modules/projects/project.entity";

function findCityId(cities: CityEntity[], name: string) {
	return cities.find((e) => e.name === name)?.id;
}

export async function up(query: QueryBuilder<object>) {
	const cities = await query
		.select(["c.id AS id", "c.name AS name"])
		.from(CityEntity, "c")
		.getRawMany<CityEntity>();

	const projects: Omit<
		ProjectEntity,
		"id" | "city" | "created_at" | "updated_at"
	>[] = [
		{
			city_id: findCityId(cities, "Москва"),
			name: "Москва Проект",
			detailed_description:
				"хороший проект. В нем может находиться несколько человек",
			brief_description:
				"хороший проект. В нем может находиться несколько человек",
			photo: "project_default_image.jpg",
			price: 100_000,
			location: "Пресненская набережная, Москва",
			long: "37.6173",
			lat: "55.7558",
			link: "",
			end_date: new Date(),
		},
		{
			city_id: findCityId(cities, "Тюмень"),
			name: "Тюмень Проект",
			detailed_description:
				"хороший проект. В нем может находиться несколько человек",
			brief_description:
				"хороший проект. В нем может находиться несколько человек",
			photo: "project_default_image.jpg",
			price: 200_000,
			location: "Тюмень, Тюменская область",
			long: "65.5619",
			lat: "57.1553",
			link: "",
			end_date: new Date(),
		},
		{
			city_id: findCityId(cities, "Новосибирск"),
			name: "Новосибирск Проект",
			detailed_description:
				"хороший проект. В нем может находиться несколько человек",
			brief_description:
				"хороший проект. В нем может находиться несколько человек",
			photo: "project_default_image.jpg",
			price: 150_000,
			location: "Пресненская набережная, Новосибирск",
			long: "82.8964",
			lat: "54.9833",
			link: "",
			end_date: new Date(),
		},
		{
			city_id: findCityId(cities, "Екатеринбург"),
			name: "Екатеринбург Проект",
			detailed_description:
				"хороший проект. В нем может находиться несколько человек",
			brief_description:
				"хороший проект. В нем может находиться несколько человек",
			photo: "project_default_image.jpg",
			price: 120_000,
			location: "Пресненская набережная, Екатеринбург",
			long: "60.6454",
			lat: "56.8431",
			link: "",
			end_date: new Date(),
		},
		{
			city_id: findCityId(cities, "Сургут"),
			name: "Сургут Проект",
			detailed_description:
				"хороший проект. В нем может находиться несколько человек",
			brief_description:
				"хороший проект. В нем может находиться несколько человек",
			photo: "project_default_image.jpg",
			price: 100_000,
			location: "Пресненская набережная, Сургут",
			long: "37.6173",
			lat: "55.7558",
			link: "",
			end_date: new Date(),
		},
		{
			city_id: findCityId(cities, "Курган"),
			name: "Курган Проект",
			detailed_description:
				"хороший проект. В нем может находиться несколько человек",
			brief_description:
				"хороший проект. В нем может находиться несколько человек",
			photo: "project_default_image.jpg",
			price: 90_000,
			location: "Пресненская набережная, Курган",
			long: "61.2546",
			lat: "73.3962",
			link: "",
			end_date: new Date(),
		},
		{
			city_id: findCityId(cities, "Омск"),
			name: "Омск Проект",
			detailed_description:
				"хороший проект. В нем может находиться несколько человек",
			brief_description:
				"хороший проект. В нем может находиться несколько человек",
			photo: "project_default_image.jpg",
			price: 400_000,
			location: "Пресненская набережная, Омск",
			long: "73.3645",
			lat: "54.9914",
			link: "",
			end_date: new Date(),
		},
	];

	await query.insert().into(ProjectEntity).values(projects).execute();
}

export async function down(query: QueryBuilder<object>) {
	await query.delete().from(ProjectEntity).execute();
}
