import { QueryBuilder } from "typeorm";

import { WithOutToDto } from "types";

import { SectionsEntity } from "../../modules/sections/sections.entity";
import { BuildingsEntity } from "../../modules/buildings/buildings.entity";

function findBuildingId(buildings: BuildingsEntity[], name: string) {
	return buildings.find((e) => e.name === name)?.id ?? 0;
}

export async function up(query: QueryBuilder<object>) {
	const buildings = await query
		.select(["c.id AS id", "c.name AS name"])
		.from(BuildingsEntity, "c")
		.getRawMany<BuildingsEntity>();

	const sections: WithOutToDto<
		Omit<SectionsEntity, "id" | "building" | "createdAt" | "updatedAt">
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
