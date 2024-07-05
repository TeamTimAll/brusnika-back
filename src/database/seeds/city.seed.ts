import { QueryBuilder } from "typeorm";

import { WithOutToDto } from "types";

import { CitiesEntity } from "../../modules/cities/cities.entity";

export async function up(query: QueryBuilder<object>) {
	const cities: WithOutToDto<
		Omit<CitiesEntity, "id" | "createdAt" | "updatedAt">
	>[] = [
		{ name: "Москва" },
		{ name: "Тюмень" },
		{ name: "Новосибирск" },
		{ name: "Екатеринбург" },
		{ name: "Сургут" },
		{ name: "Курган" },
		{ name: "Омск" },
	];

	await query.insert().into(CitiesEntity).values(cities).execute();
}

export async function down(query: QueryBuilder<object>) {
	await query.delete().from(CitiesEntity).execute();
}
