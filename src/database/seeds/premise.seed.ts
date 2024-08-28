import { QueryBuilder } from "typeorm";

import { BuildingEntity } from "../../modules/buildings/buildings.entity";
import {
	CommercialStatus,
	PremiseEntity,
	PremisesType,
	PuchaseOptions,
} from "../../modules/premises/premises.entity";
import { SectionEntity } from "../../modules/sections/sections.entity";

function findBuildingId(buildings: BuildingEntity[], name: string) {
	return buildings.find((e) => e.name === name)?.id ?? 0;
}

function findSectionId(
	buildings: SectionEntity[],
	building_id: number,
	name: string,
) {
	return buildings.find(
		(e) => e.name === name && e.building_id === building_id,
	)?.id;
}

export async function up(query: QueryBuilder<object>) {
	const buildings = await query
		.select(["c.id AS id", "c.name AS name"])
		.from(BuildingEntity, "c")
		.getRawMany<BuildingEntity>();

	const sections = await query
		.createQueryBuilder()
		.select([
			"s.id AS id",
			"s.name AS name",
			"s.building_id AS building_id",
		])
		.from(SectionEntity, "s")
		.getRawMany<SectionEntity>();

	const premises: Omit<
		PremiseEntity,
		| "id"
		| "section"
		| "building"
		| "created_at"
		| "updated_at"
		| "season"
		| "schema"
		| "is_active"
	>[] = [
		{
			name: "1-комнатная 30 м2",
			building_id: findBuildingId(buildings, "Москва Дом 1"),
			number: 1,
			type: PremisesType.APARTMENT,
			price: 20000,
			size: 30,
			status: CommercialStatus.FREE,
			purchaseOption: PuchaseOptions.MORTAGE,
			floor: 1,
			photo: "premise_apartment_default_image.jpg",
			rooms: 5,
			photos: [
				"premise_apartment_default_image.jpg",
				"premise_apartment_default_image.jpg",
			],
			similiarApartmentCount: 0,
			mortagePayment: 100,
			is_sold: false,
			section_id: findSectionId(
				sections,
				findBuildingId(buildings, "Москва Дом 1"),
				"Секция 1",
			),
		},
		{
			name: "1-комнатная 30 м2",
			building_id: findBuildingId(buildings, "Москва Дом 2"),
			number: 1,
			type: PremisesType.APARTMENT,
			price: 20000,
			size: 30,
			status: CommercialStatus.FREE,
			purchaseOption: PuchaseOptions.MORTAGE,
			floor: 1,
			photo: "premise_apartment_default_image.jpg",
			rooms: 5,
			photos: [
				"premise_apartment_default_image.jpg",
				"premise_apartment_default_image.jpg",
			],
			similiarApartmentCount: 0,
			mortagePayment: 100,
			is_sold: false,
			section_id: findSectionId(
				sections,
				findBuildingId(buildings, "Москва Дом 2"),
				"Секция 1",
			),
		},
		{
			name: "1-комнатная 30 м2",
			building_id: findBuildingId(buildings, "Москва Дом 3"),
			number: 1,
			type: PremisesType.APARTMENT,
			price: 20000,
			size: 30,
			status: CommercialStatus.FREE,
			purchaseOption: PuchaseOptions.MORTAGE,
			floor: 1,
			photo: "premise_apartment_default_image.jpg",
			rooms: 5,
			photos: [
				"premise_apartment_default_image.jpg",
				"premise_apartment_default_image.jpg",
			],
			similiarApartmentCount: 0,
			mortagePayment: 100,
			is_sold: false,
			section_id: findSectionId(
				sections,
				findBuildingId(buildings, "Москва Дом 3"),
				"Секция 1",
			),
		},

		{
			name: "1-комнатная 30 м2",
			building_id: findBuildingId(buildings, "Тюмень Дом 1"),
			number: 1,
			type: PremisesType.APARTMENT,
			price: 20000,
			size: 30,
			status: CommercialStatus.FREE,
			purchaseOption: PuchaseOptions.MORTAGE,
			floor: 1,
			photo: "premise_apartment_default_image.jpg",
			rooms: 5,
			photos: [
				"premise_apartment_default_image.jpg",
				"premise_apartment_default_image.jpg",
			],
			similiarApartmentCount: 0,
			mortagePayment: 100,
			is_sold: false,
			section_id: findSectionId(
				sections,
				findBuildingId(buildings, "Тюмень Дом 1"),
				"Секция 1",
			),
		},
		{
			name: "1-комнатная 30 м2",
			building_id: findBuildingId(buildings, "Тюмень Дом 2"),
			number: 1,
			type: PremisesType.APARTMENT,
			price: 20000,
			size: 30,
			status: CommercialStatus.FREE,
			purchaseOption: PuchaseOptions.MORTAGE,
			floor: 1,
			photo: "premise_apartment_default_image.jpg",
			rooms: 5,
			photos: [
				"premise_apartment_default_image.jpg",
				"premise_apartment_default_image.jpg",
			],
			similiarApartmentCount: 0,
			mortagePayment: 100,
			is_sold: false,
			section_id: findSectionId(
				sections,
				findBuildingId(buildings, "Тюмень Дом 2"),
				"Секция 1",
			),
		},
		{
			name: "1-комнатная 30 м2",
			building_id: findBuildingId(buildings, "Тюмень Дом 3"),
			number: 1,
			type: PremisesType.APARTMENT,
			price: 20000,
			size: 30,
			status: CommercialStatus.FREE,
			purchaseOption: PuchaseOptions.MORTAGE,
			floor: 1,
			photo: "premise_apartment_default_image.jpg",
			rooms: 5,
			photos: [
				"premise_apartment_default_image.jpg",
				"premise_apartment_default_image.jpg",
			],
			similiarApartmentCount: 0,
			mortagePayment: 100,
			is_sold: false,
			section_id: findSectionId(
				sections,
				findBuildingId(buildings, "Тюмень Дом 3"),
				"Секция 1",
			),
		},

		{
			name: "1-комнатная 30 м2",
			building_id: findBuildingId(buildings, "Новосибирск Дом 1"),
			number: 1,
			type: PremisesType.APARTMENT,
			price: 20000,
			size: 30,
			status: CommercialStatus.FREE,
			purchaseOption: PuchaseOptions.MORTAGE,
			floor: 1,
			photo: "premise_apartment_default_image.jpg",
			rooms: 5,
			photos: [
				"premise_apartment_default_image.jpg",
				"premise_apartment_default_image.jpg",
			],
			similiarApartmentCount: 0,
			mortagePayment: 100,
			is_sold: false,
			section_id: findSectionId(
				sections,
				findBuildingId(buildings, "Новосибирск Дом 1"),
				"Секция 1",
			),
		},
		{
			name: "1-комнатная 30 м2",
			building_id: findBuildingId(buildings, "Новосибирск Дом 2"),
			number: 1,
			type: PremisesType.APARTMENT,
			price: 20000,
			size: 30,
			status: CommercialStatus.FREE,
			purchaseOption: PuchaseOptions.MORTAGE,
			floor: 1,
			photo: "premise_apartment_default_image.jpg",
			rooms: 5,
			photos: [
				"premise_apartment_default_image.jpg",
				"premise_apartment_default_image.jpg",
			],
			similiarApartmentCount: 0,
			mortagePayment: 100,
			is_sold: false,
			section_id: findSectionId(
				sections,
				findBuildingId(buildings, "Новосибирск Дом 2"),
				"Секция 1",
			),
		},
		{
			name: "1-комнатная 30 м2",
			building_id: findBuildingId(buildings, "Новосибирск Дом 3"),
			number: 1,
			type: PremisesType.APARTMENT,
			price: 20000,
			size: 30,
			status: CommercialStatus.FREE,
			purchaseOption: PuchaseOptions.MORTAGE,
			floor: 1,
			photo: "premise_apartment_default_image.jpg",
			rooms: 5,
			photos: [
				"premise_apartment_default_image.jpg",
				"premise_apartment_default_image.jpg",
			],
			similiarApartmentCount: 0,
			mortagePayment: 100,
			is_sold: false,
			section_id: findSectionId(
				sections,
				findBuildingId(buildings, "Новосибирск Дом 3"),
				"Секция 1",
			),
		},

		{
			name: "1-комнатная 30 м2",
			building_id: findBuildingId(buildings, "Екатеринбург Дом 1"),
			number: 1,
			type: PremisesType.APARTMENT,
			price: 20000,
			size: 30,
			status: CommercialStatus.FREE,
			purchaseOption: PuchaseOptions.MORTAGE,
			floor: 1,
			photo: "premise_apartment_default_image.jpg",
			rooms: 5,
			photos: [
				"premise_apartment_default_image.jpg",
				"premise_apartment_default_image.jpg",
			],
			similiarApartmentCount: 0,
			mortagePayment: 100,
			is_sold: false,
			section_id: findSectionId(
				sections,
				findBuildingId(buildings, "Екатеринбург Дом 1"),
				"Секция 1",
			),
		},
		{
			name: "1-комнатная 30 м2",
			building_id: findBuildingId(buildings, "Екатеринбург Дом 2"),
			number: 1,
			type: PremisesType.APARTMENT,
			price: 20000,
			size: 30,
			status: CommercialStatus.FREE,
			purchaseOption: PuchaseOptions.MORTAGE,
			floor: 1,
			photo: "premise_apartment_default_image.jpg",
			rooms: 5,
			photos: [
				"premise_apartment_default_image.jpg",
				"premise_apartment_default_image.jpg",
			],
			similiarApartmentCount: 0,
			mortagePayment: 100,
			is_sold: false,
			section_id: findSectionId(
				sections,
				findBuildingId(buildings, "Екатеринбург Дом 2"),
				"Секция 1",
			),
		},
		{
			name: "1-комнатная 30 м2",
			building_id: findBuildingId(buildings, "Екатеринбург Дом 3"),
			number: 1,
			type: PremisesType.APARTMENT,
			price: 20000,
			size: 30,
			status: CommercialStatus.FREE,
			purchaseOption: PuchaseOptions.MORTAGE,
			floor: 1,
			photo: "premise_apartment_default_image.jpg",
			rooms: 5,
			photos: [
				"premise_apartment_default_image.jpg",
				"premise_apartment_default_image.jpg",
			],
			similiarApartmentCount: 0,
			mortagePayment: 100,
			is_sold: false,
			section_id: findSectionId(
				sections,
				findBuildingId(buildings, "Екатеринбург Дом 3"),
				"Секция 1",
			),
		},

		{
			name: "1-комнатная 30 м2",
			building_id: findBuildingId(buildings, "Сургут Дом 1"),
			number: 1,
			type: PremisesType.APARTMENT,
			price: 20000,
			size: 30,
			status: CommercialStatus.FREE,
			purchaseOption: PuchaseOptions.MORTAGE,
			floor: 1,
			photo: "premise_apartment_default_image.jpg",
			rooms: 5,
			photos: [
				"premise_apartment_default_image.jpg",
				"premise_apartment_default_image.jpg",
			],
			similiarApartmentCount: 0,
			mortagePayment: 100,
			is_sold: false,
			section_id: findSectionId(
				sections,
				findBuildingId(buildings, "Сургут Дом 1"),
				"Секция 1",
			),
		},
		{
			name: "1-комнатная 30 м2",
			building_id: findBuildingId(buildings, "Сургут Дом 2"),
			number: 1,
			type: PremisesType.APARTMENT,
			price: 20000,
			size: 30,
			status: CommercialStatus.FREE,
			purchaseOption: PuchaseOptions.MORTAGE,
			floor: 1,
			photo: "premise_apartment_default_image.jpg",
			rooms: 5,
			photos: [
				"premise_apartment_default_image.jpg",
				"premise_apartment_default_image.jpg",
			],
			similiarApartmentCount: 0,
			mortagePayment: 100,
			is_sold: false,
			section_id: findSectionId(
				sections,
				findBuildingId(buildings, "Сургут Дом 2"),
				"Секция 1",
			),
		},
		{
			name: "1-комнатная 30 м2",
			building_id: findBuildingId(buildings, "Сургут Дом 3"),
			number: 1,
			type: PremisesType.APARTMENT,
			price: 20000,
			size: 30,
			status: CommercialStatus.FREE,
			purchaseOption: PuchaseOptions.MORTAGE,
			floor: 1,
			photo: "premise_apartment_default_image.jpg",
			rooms: 5,
			photos: [
				"premise_apartment_default_image.jpg",
				"premise_apartment_default_image.jpg",
			],
			similiarApartmentCount: 0,
			mortagePayment: 100,
			is_sold: false,
			section_id: findSectionId(
				sections,
				findBuildingId(buildings, "Сургут Дом 3"),
				"Секция 1",
			),
		},

		{
			name: "1-комнатная 30 м2",
			building_id: findBuildingId(buildings, "Курган Дом 1"),
			number: 1,
			type: PremisesType.APARTMENT,
			price: 20000,
			size: 30,
			status: CommercialStatus.FREE,
			purchaseOption: PuchaseOptions.MORTAGE,
			floor: 1,
			photo: "premise_apartment_default_image.jpg",
			rooms: 5,
			photos: [
				"premise_apartment_default_image.jpg",
				"premise_apartment_default_image.jpg",
			],
			similiarApartmentCount: 0,
			mortagePayment: 100,
			is_sold: false,
			section_id: findSectionId(
				sections,
				findBuildingId(buildings, "Курган Дом 1"),
				"Секция 1",
			),
		},
		{
			name: "1-комнатная 30 м2",
			building_id: findBuildingId(buildings, "Курган Дом 2"),
			number: 1,
			type: PremisesType.APARTMENT,
			price: 20000,
			size: 30,
			status: CommercialStatus.FREE,
			purchaseOption: PuchaseOptions.MORTAGE,
			floor: 1,
			photo: "premise_apartment_default_image.jpg",
			rooms: 5,
			photos: [
				"premise_apartment_default_image.jpg",
				"premise_apartment_default_image.jpg",
			],
			similiarApartmentCount: 0,
			mortagePayment: 100,
			is_sold: false,
			section_id: findSectionId(
				sections,
				findBuildingId(buildings, "Курган Дом 2"),
				"Секция 1",
			),
		},
		{
			name: "1-комнатная 30 м2",
			building_id: findBuildingId(buildings, "Курган Дом 3"),
			number: 1,
			type: PremisesType.APARTMENT,
			price: 20000,
			size: 30,
			status: CommercialStatus.FREE,
			purchaseOption: PuchaseOptions.MORTAGE,
			floor: 1,
			photo: "premise_apartment_default_image.jpg",
			rooms: 5,
			photos: [
				"premise_apartment_default_image.jpg",
				"premise_apartment_default_image.jpg",
			],
			similiarApartmentCount: 0,
			mortagePayment: 100,
			is_sold: false,
			section_id: findSectionId(
				sections,
				findBuildingId(buildings, "Курган Дом 3"),
				"Секция 1",
			),
		},

		{
			name: "1-комнатная 30 м2",
			building_id: findBuildingId(buildings, "Омск Дом 1"),
			number: 1,
			type: PremisesType.APARTMENT,
			price: 20000,
			size: 30,
			status: CommercialStatus.FREE,
			purchaseOption: PuchaseOptions.MORTAGE,
			floor: 1,
			photo: "premise_apartment_default_image.jpg",
			rooms: 5,
			photos: [
				"premise_apartment_default_image.jpg",
				"premise_apartment_default_image.jpg",
			],
			similiarApartmentCount: 0,
			mortagePayment: 100,
			is_sold: false,
			section_id: findSectionId(
				sections,
				findBuildingId(buildings, "Омск Дом 1"),
				"Секция 1",
			),
		},
		{
			name: "1-комнатная 30 м2",
			building_id: findBuildingId(buildings, "Омск Дом 2"),
			number: 1,
			type: PremisesType.APARTMENT,
			price: 20000,
			size: 30,
			status: CommercialStatus.FREE,
			purchaseOption: PuchaseOptions.MORTAGE,
			floor: 1,
			photo: "premise_apartment_default_image.jpg",
			rooms: 5,
			photos: [
				"premise_apartment_default_image.jpg",
				"premise_apartment_default_image.jpg",
			],
			similiarApartmentCount: 0,
			mortagePayment: 100,
			is_sold: false,
			section_id: findSectionId(
				sections,
				findBuildingId(buildings, "Омск Дом 2"),
				"Секция 1",
			),
		},
		{
			name: "1-комнатная 30 м2",
			building_id: findBuildingId(buildings, "Омск Дом 3"),
			number: 1,
			type: PremisesType.APARTMENT,
			price: 20000,
			size: 30,
			status: CommercialStatus.FREE,
			purchaseOption: PuchaseOptions.MORTAGE,
			floor: 1,
			photo: "premise_apartment_default_image.jpg",
			rooms: 5,
			photos: [
				"premise_apartment_default_image.jpg",
				"premise_apartment_default_image.jpg",
			],
			similiarApartmentCount: 0,
			mortagePayment: 100,
			is_sold: false,
			section_id: findSectionId(
				sections,
				findBuildingId(buildings, "Омск Дом 3"),
				"Секция 1",
			),
		},
		{
			name: "1-стоянка 30 м2",
			building_id: findBuildingId(buildings, "Омск Дом 3"),
			number: 1,
			type: PremisesType.PARKING,
			price: 20000,
			size: 30,
			status: CommercialStatus.FREE,
			purchaseOption: PuchaseOptions.MORTAGE,
			floor: 1,
			photo: "premise_parking_default_image.jpg",
			rooms: 5,
			photos: [
				"premise_parking_default_image.jpg",
				"premise_parking_default_image.jpg",
			],
			similiarApartmentCount: 0,
			mortagePayment: 100,
			is_sold: false,
			section_id: findSectionId(
				sections,
				findBuildingId(buildings, "Омск Дом 3"),
				"Секция 1",
			),
		},
		{
			name: "1-кладовка 30 м2",
			building_id: findBuildingId(buildings, "Омск Дом 3"),
			number: 1,
			type: PremisesType.STOREROOM,
			price: 20000,
			size: 30,
			status: CommercialStatus.FREE,
			purchaseOption: PuchaseOptions.MORTAGE,
			floor: 1,
			photo: "premise_storeroom_default_image.jpg",
			rooms: 5,
			photos: [
				"premise_storeroom_default_image.jpg",
				"premise_storeroom_default_image.jpg",
			],
			similiarApartmentCount: 0,
			mortagePayment: 100,
			is_sold: false,
			section_id: findSectionId(
				sections,
				findBuildingId(buildings, "Омск Дом 3"),
				"Секция 1",
			),
		},
	];

	await query.insert().into(PremiseEntity).values(premises).execute();
}

export async function down(query: QueryBuilder<object>) {
	await query.delete().from(PremiseEntity).execute();
}
