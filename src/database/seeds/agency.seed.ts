import { faker } from "@faker-js/faker";
import { QueryBuilder } from "typeorm";

import { AgencyEntity } from "../../modules/agencies/agencies.entity";
import { CityEntity } from "../../modules/cities/cities.entity";

type IAgencyEntity = Omit<
	AgencyEntity,
	| "id"
	| "city"
	| "created_at"
	| "updated_at"
	| "is_active"
	| "create_by"
	| "user"
	| "ext_id"
	| "entry_doc"
	| "company_card_doc"
	| "tax_registration_doc"
	| "authority_signatory_doc"
>;

function createAgency(city_id: number) {
	const name = faker.company.name();
	const agency: IAgencyEntity = {
		title: name,
		legalName: name,
		inn: faker.number
			.bigInt({
				min: 1000000000,
				max: 9999999999,
			})
			.toString(),
		phone: faker.number
			.bigInt({
				min: 70000000000,
				max: 79999999999,
			})
			.toString(),
		email: faker.internet.email({ firstName: name }),
		ownerFullName: faker.person.fullName(),
		ownerPhone: faker.number
			.bigInt({
				min: 70000000000,
				max: 79999999999,
			})
			.toString(),
		city_id: city_id,
	};
	return agency;
}

export async function up(
	query: QueryBuilder<object>,
	cities: CityEntity[],
): Promise<AgencyEntity[]> {
	const agencies: IAgencyEntity[] = [];

	cities.forEach((city) => {
		const len = faker.number.int({ min: 2, max: 5 });
		for (let i = 0; i < len; i++) {
			agencies.push(createAgency(city.id));
		}
	});

	const { generatedMaps } = await query
		.insert()
		.into(AgencyEntity)
		.returning("*")
		.values(agencies)
		.execute();
	return generatedMaps as AgencyEntity[];
}

export async function down(query: QueryBuilder<object>) {
	await query.delete().from(AgencyEntity).execute();
}
