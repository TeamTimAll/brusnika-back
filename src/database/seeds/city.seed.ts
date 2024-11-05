import { DataSource, QueryBuilder } from "typeorm";

import { CityEntity } from "../../modules/cities/cities.entity";

type ICityEntity = Omit<
	CityEntity,
	"id" | "ext_id" | "created_at" | "updated_at" | "is_active"
>;

export async function up(query: QueryBuilder<object>): Promise<CityEntity[]> {
	const cities: ICityEntity[] = [
		{ name: "Москва", long: "37.6173", lat: "55.7558" },
		{ name: "Тюмень", long: "65.5619", lat: "57.1553" },
		{ name: "Новосибирск", long: "82.8964", lat: "54.9833" },
		{ name: "Екатеринбург", long: "60.6454", lat: "56.8431" },
		{ name: "Сургут", long: "73.393032", lat: "61.241778" },
		{ name: "Курган", long: "65.341118", lat: "55.441004" },
		{ name: "Омск", long: "73.3645", lat: "54.9914" },
	];

	const { generatedMaps } = await query
		.insert()
		.into(CityEntity)
		.values(cities)
		.returning("*")
		.execute();
	return generatedMaps as CityEntity[];
}

export async function down(dataSource: DataSource) {
	const tableName = dataSource.getMetadata(CityEntity).tableName;
	await dataSource.query(`TRUNCATE ${tableName} RESTART IDENTITY CASCADE;`);
}
