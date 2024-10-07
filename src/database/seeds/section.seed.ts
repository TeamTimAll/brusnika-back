import { QueryBuilder } from "typeorm";

import { BuildingEntity } from "../../modules/buildings/buildings.entity";
import { SectionEntity } from "../../modules/sections/sections.entity";

function findBuildingId(buildings: BuildingEntity[], name: string) {
	return buildings.find((e) => e.name === name)?.id ?? 0;
}

type ISectionEntity = Omit<
	SectionEntity,
	"id" | "ext_id" | "building" | "created_at" | "updated_at" | "is_active"
>;

export async function up(
	query: QueryBuilder<object>,
	buildings: BuildingEntity[],
): Promise<SectionEntity[]> {
	const sections: ISectionEntity[] = [
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

	const { generatedMaps } = await query
		.insert()
		.into(SectionEntity)
		.values(sections)
		.returning("*")
		.execute();
	return generatedMaps as SectionEntity[];
}

export async function down(query: QueryBuilder<object>) {
	await query.delete().from(SectionEntity).execute();
}
