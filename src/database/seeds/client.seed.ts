import { DataSource, QueryBuilder } from "typeorm";

import { chunkArray } from "../../lib/array";
import {
	ClientEntity,
	ConfirmationType,
	FixingType,
} from "../../modules/client/client.entity";
import { UserEntity } from "../../modules/user/user.entity";

import { faker } from "./faker";

type IClientEntity = Omit<
	ClientEntity,
	| "id"
	| "ext_id"
	| "leads"
	| "agent"
	| "bookings"
	| "visits"
	| "created_at"
	| "updated_at"
	| "is_active"
>;

function createClient(agent_id: number) {
	const client: IClientEntity = {
		fullname: faker.person.fullName(),
		phone_number: faker.number
			.bigInt({
				min: 70000000000,
				max: 79999999999,
			})
			.toString(),
		actived_date: faker.date.recent(),
		comment: faker.lorem.words({ min: 5, max: 10 }),
		fixing_type: faker.helpers.arrayElement([
			FixingType.LEAD_VERIFICATION,
			FixingType.CENCEL_FIXING,
			FixingType.STRONG_FIXING,
			FixingType.WEAK_FIXING,
		]),
		expiration_date: faker.date.future(),
		node: faker.lorem.words({ min: 15, max: 30 }),
		agent_id: agent_id,
		confirmation_type: faker.helpers.arrayElement([
			ConfirmationType.PHONE,
			ConfirmationType.SMS,
		]),
	};
	return client;
}

export async function up(
	query: QueryBuilder<object>,
	agents: UserEntity[],
): Promise<ClientEntity[]> {
	const clients: IClientEntity[] = [];

	agents.forEach((agent) => {
		const len = faker.number.int({ min: 5, max: 20 });
		for (let i = 0; i < len; i++) {
			clients.push(createClient(agent.id));
		}
	});

	const chunks = chunkArray(clients, 50);

	const res: ClientEntity[][] = [];
	for await (const chunk of chunks) {
		const { generatedMaps } = await query
			.insert()
			.into(ClientEntity)
			.values(chunk)
			.returning("*")
			.execute();
		res.push(generatedMaps as ClientEntity[]);
	}
	return res.flat();
}

export async function down(dataSource: DataSource) {
	const tableName = dataSource.getMetadata(ClientEntity).tableName;
	await dataSource.query(`TRUNCATE ${tableName} RESTART IDENTITY CASCADE;`);
}
