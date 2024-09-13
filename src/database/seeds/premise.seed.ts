import { faker } from "@faker-js/faker";
import { QueryBuilder } from "typeorm";

import { chunkArray } from "../../lib/array";
import { BuildingEntity } from "../../modules/buildings/buildings.entity";
import {
	CommercialStatus,
	PremiseEntity,
	PremisesType,
	PuchaseOptions,
} from "../../modules/premises/premises.entity";
import { SectionEntity } from "../../modules/sections/sections.entity";

type IPremiseEntity = Omit<
	PremiseEntity,
	| "id"
	| "section"
	| "building"
	| "created_at"
	| "updated_at"
	| "season"
	| "schema"
	| "is_active"
>;

const typeRussianName = new Map([
	[PremisesType.APARTMENT, "комнатная"],
	[PremisesType.STOREROOM, "кладовка"],
	[PremisesType.PARKING, "стоянка"],
	[PremisesType.COMMERCIAL, "коммерческий"],
]);

function createPremise(
	building_id: number,
	section_id: number,
	studio?: boolean,
): IPremiseEntity {
	const number = faker.number.int({ min: 1, max: 40 });
	const size = faker.number.int({ min: 20, max: 40 });
	const type = faker.helpers.arrayElement([
		PremisesType.APARTMENT,
		PremisesType.STOREROOM,
		PremisesType.PARKING,
		PremisesType.COMMERCIAL,
	]);
	const name =
		number +
		"-" +
		(studio ? "студия" : typeRussianName.get(type)) +
		" " +
		size +
		" м2";

	const premise: IPremiseEntity = {
		name: name,
		building_id: building_id,
		number: number,
		type: type,
		price: faker.number.bigInt({ min: 1000000, max: 5000000 }),
		size: size,
		status: CommercialStatus.FREE,
		purchaseOption: faker.helpers.arrayElements([
			PuchaseOptions.MORTAGE,
			PuchaseOptions.INSTALLMENT,
			PuchaseOptions.BILL,
			PuchaseOptions.FULL_PAYMENT,
		]),
		floor: faker.number.int({ min: 1, max: 9 }),
		photo: "premise_apartment_default_image.jpg",
		rooms: studio ? 0 : faker.number.int({ min: 1, max: 5 }),
		photos: [
			"premise_apartment_default_image.jpg",
			"premise_apartment_default_image.jpg",
		],
		similiarApartmentCount: 0,
		mortagePayment: faker.number.int({ min: 100, max: 900 }),
		is_sold: false,
		section_id: section_id,
	};
	return premise;
}

export async function up(
	query: QueryBuilder<object>,
	buildings: BuildingEntity[],
	sections: SectionEntity[],
): Promise<PremiseEntity[]> {
	const premises: IPremiseEntity[] = [];

	buildings.forEach((building) => {
		sections.forEach((section) => {
			for (let i = 0; i < 10; i++) {
				premises.push(createPremise(building.id, section.id));
			}
			for (let i = 0; i < 2; i++) {
				premises.push(createPremise(building.id, section.id, true));
			}
		});
	});

	const chunks = chunkArray(premises, 50);

	const res: PremiseEntity[][] = [];
	for await (const chunk of chunks) {
		const { generatedMaps } = await query
			.insert()
			.into(PremiseEntity)
			.values(chunk)
			.returning("*")
			.execute();
		res.push(generatedMaps as PremiseEntity[]);
	}
	return res.flat();
}

export async function down(query: QueryBuilder<object>) {
	await query.delete().from(PremiseEntity).execute();
}
