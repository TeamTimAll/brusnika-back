import { faker } from "@faker-js/faker";
import { QueryBuilder } from "typeorm";

import { chunkArray } from "../../lib/array";
import { BuildingEntity } from "../../modules/buildings/buildings.entity";
import { PremiseSchemaEntity } from "../../modules/premises/premise_schema.entity";
import {
	CommercialStatus,
	PremiseEntity,
	PremiseFeature,
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

type IPremiseSchema = Omit<
	PremiseSchemaEntity,
	"id" | "premise" | "created_at" | "updated_at" | "is_active"
>;

function createPremiseSchema(premise_id: number): IPremiseSchema {
	const schema: IPremiseSchema = {
		schema_image: "premise_schema_default_image.png",
		premise_id: premise_id,
	};
	return schema;
}

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

	const features: Set<PremiseFeature> = new Set();

	for (let i = 0; i < faker.number.int({ min: 1, max: 8 }); i++) {
		features.add(faker.helpers.enumValue(PremiseFeature));
	}

	const premise: IPremiseEntity = {
		name: name,
		building_id: building_id,
		number: number,
		type: type,
		price: faker.number.bigInt({ min: 1000000, max: 5000000 }),
		size: size,
		status: CommercialStatus.FREE,
		purchase_option: faker.helpers.arrayElements([
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
		feature: [...features],
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

	const premiseResult = res.flat();

	const premiseSchemas: IPremiseSchema[] = [];

	premiseResult.forEach((premise) => {
		premiseSchemas.push(createPremiseSchema(premise.id));
	});

	const schemaChunks = chunkArray(premiseSchemas, 50);

	const resPremiseSchema: PremiseSchemaEntity[][] = [];
	for await (const chunk of schemaChunks) {
		const { generatedMaps } = await query
			.insert()
			.into(PremiseSchemaEntity)
			.values(chunk)
			.returning("*")
			.execute();
		resPremiseSchema.push(generatedMaps as PremiseSchemaEntity[]);
	}

	const premiseWithSchema: Pick<PremiseEntity, "id" | "schema_id">[] = [];

	resPremiseSchema.flat().forEach((schema) => {
		premiseWithSchema.push({ id: schema.premise_id, schema_id: schema.id });
	});

	for await (const chunk of premiseWithSchema) {
		await query
			.update(PremiseEntity)
			.set({ schema_id: chunk.schema_id })
			.where("id = :id", {
				id: chunk.id,
			})
			.returning("*")
			.execute();
	}

	return premiseResult;
}

export async function down(query: QueryBuilder<object>) {
	await query.delete().from(PremiseEntity).execute();
}
