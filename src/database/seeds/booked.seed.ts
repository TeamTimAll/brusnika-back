import { faker } from "@faker-js/faker";
import { QueryBuilder } from "typeorm";

import {
	BookingStatus,
	BookingsEntity,
	PuchaseOptions,
} from "../../modules/bookings/bookings.entity";
import { ClientEntity } from "../../modules/client/client.entity";
import { LeadsEntity } from "../../modules/leads/leads.entity";
import { chunkArray } from "../../lib/array";

type IBookingsEntity = Omit<
	BookingsEntity,
	| "id"
	| "premise"
	| "client"
	| "agent"
	| "created_at"
	| "updated_at"
	| "create_by"
	| "is_active"
>;

function createBooking(
	agent_id: number,
	client_id: number,
	premise_id: number,
): IBookingsEntity {
	const booking: IBookingsEntity = {
		agent_id: agent_id,
		client_id: client_id,
		premise_id: premise_id,
		date: faker.date.future(),
		time: faker.date.anytime().toISOString().split("T")[1].split(".")[0],
		purchase_option: faker.helpers.arrayElement([
			PuchaseOptions.MORTAGE,
			PuchaseOptions.INSTALLMENT,
			PuchaseOptions.BILL,
			PuchaseOptions.FULL_PAYMENT,
		]),
		status: faker.helpers.arrayElement([
			BookingStatus.OPEN,
			BookingStatus.SUCCESS,
			BookingStatus.FAIL,
		]),
	};
	return booking;
}

export async function up(
	query: QueryBuilder<object>,
	bookedClients: ClientEntity[],
	leads: LeadsEntity[],
) {
	const bookings: IBookingsEntity[] = [];
	bookedClients.forEach((client) => {
		const lead = leads.find((lead) => lead.client_id === client.id);
		if (lead) {
			bookings.push(
				createBooking(client.agent_id, client.id, lead.premise_id),
			);
		}
	});

	const chunks = chunkArray(bookings, 50);

	const res: BookingsEntity[][] = [];
	for await (const chunk of chunks) {
		const { generatedMaps } = await query
			.insert()
			.into(BookingsEntity)
			.values(chunk)
			.returning("*")
			.execute();
		res.push(generatedMaps as BookingsEntity[]);
	}
	return res.flat();
}

export async function down(query: QueryBuilder<object>) {
	await query.delete().from(BookingsEntity).execute();
}
