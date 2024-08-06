import { QueryBuilder } from "typeorm";

import { SectionsEntity } from "../../modules/sections/sections.entity";
import { BuildingEntity } from "../../modules/buildings/buildings.entity";

function findBuildingId(buildings: BuildingEntity[], name: string) {
	return buildings.find((e) => e.name === name)?.id ?? 0;
}

export async function up(query: QueryBuilder<object>) {
	const buildings = await query
		.select(["c.id AS id", "c.name AS name"])
		.from(BuildingEntity, "c")
		.getRawMany<BuildingEntity>();

	const sections: Omit<
		SectionsEntity,
		"id" | "building" | "createdAt" | "updatedAt"
	>[] = [
		{
			name: "Секция 1",
			building_id: findBuildingId(buildings, "Москва Дом 1"),
		},
		{
			name: "Секция 2",
			building_id: findBuildingId(buildings, "Москва Дом 1"),
		},
		{
			name: "Секция 3",
			building_id: findBuildingId(buildings, "Москва Дом 1"),
		},

		{
			name: "Секция 1",
			building_id: findBuildingId(buildings, "Москва Дом 2"),
		},
		{
			name: "Секция 2",
			building_id: findBuildingId(buildings, "Москва Дом 2"),
		},
		{
			name: "Секция 3",
			building_id: findBuildingId(buildings, "Москва Дом 2"),
		},

		{
			name: "Секция 1",
			building_id: findBuildingId(buildings, "Москва Дом 3"),
		},
		{
			name: "Секция 2",
			building_id: findBuildingId(buildings, "Москва Дом 3"),
		},
		{
			name: "Секция 3",
			building_id: findBuildingId(buildings, "Москва Дом 3"),
		},
	];

	await query.insert().into(SectionsEntity).values(sections).execute();
}

export async function down(query: QueryBuilder<object>) {
	await query.delete().from(SectionsEntity).execute();
}
