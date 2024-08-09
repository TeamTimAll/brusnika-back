import { QueryBuilder } from "typeorm";

import { CityEntity } from "../../modules/cities/cities.entity";

export async function up(query: QueryBuilder<object>) {
	const cities: Omit<CityEntity, "id" | "created_at" | "updated_at">[] = [
		{ name: "Москва", long: "37.6173", lat: "55.7558" },
		{ name: "Тюмень", long: "65.5619", lat: "57.1553" },
		{ name: "Новосибирск", long: "82.8964", lat: "54.9833" },
		{ name: "Екатеринбург", long: "60.6454", lat: "56.8431" },
		{ name: "Сургут", long: "73.3962", lat: "61.2546" },
		{ name: "Курган", long: "65.3493", lat: "55.4590" },
		{ name: "Омск", long: "73.3645", lat: "54.9914" },
	];

	await query.insert().into(CityEntity).values(cities).execute();
}

export async function down(query: QueryBuilder<object>) {
	await query.delete().from(CityEntity).execute();
}
