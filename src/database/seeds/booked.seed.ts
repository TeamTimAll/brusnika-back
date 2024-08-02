import { QueryBuilder } from "typeorm";

import {
	BookingStatus,
	BookingsEntity,
	PuchaseOptions,
} from "../../modules/bookings/bookings.entity";
import { ClientEntity } from "../../modules/client/client.entity";
import { PremisesEntity } from "../../modules/premises/premises.entity";
import { UserEntity } from "../../modules/user/user.entity";

export async function up(query: QueryBuilder<object>) {
	const [agent] = await query
		.createQueryBuilder()
		.select()
		.from(UserEntity, "u")
		.where("email = :email", { email: "jondoeagent@gmail.com" })
		.getRawMany<UserEntity>();
	const [client] = await query
		.createQueryBuilder()
		.select()
		.from(ClientEntity, "c")
		.where("phone_number = :phone_number", {
			phone_number: "71234567890",
		})
		.getRawMany<UserEntity>();
	const [premise] = await query
		.createQueryBuilder()
		.select()
		.from(PremisesEntity, "p")
		.where("name = :name", {
			name: "1-комнатная 30 м2",
		})
		.getRawMany<UserEntity>();

	const bookings: Omit<
		BookingsEntity,
		"id" | "premise" | "client" | "agent" | "createdAt" | "updatedAt" | "create_by"
	>[] = [
		{
			agent_id: agent.id,
			client_id: client.id,
			premise_id: premise.id,
			date: new Date(),
			time: "10:00",
			purchase_option: PuchaseOptions.MORTAGE,
			status: BookingStatus.OPEN,
		},
		{
			agent_id: agent.id,
			client_id: client.id,
			premise_id: premise.id,
			date: new Date(),
			time: "11:00",
			purchase_option: PuchaseOptions.MORTAGE,
			status: BookingStatus.OPEN,
		},
		{
			agent_id: agent.id,
			client_id: client.id,
			premise_id: premise.id,
			date: new Date(),
			time: "12:30",
			purchase_option: PuchaseOptions.MORTAGE,
			status: BookingStatus.OPEN,
		},
		{
			agent_id: agent.id,
			client_id: client.id,
			premise_id: premise.id,
			date: new Date(),
			time: "9:00",
			purchase_option: PuchaseOptions.MORTAGE,
			status: BookingStatus.OPEN,
		},
		{
			agent_id: agent.id,
			client_id: client.id,
			premise_id: premise.id,
			date: new Date(),
			time: "10:30",
			purchase_option: PuchaseOptions.MORTAGE,
			status: BookingStatus.SUCCESS,
		},
		{
			agent_id: agent.id,
			client_id: client.id,
			premise_id: premise.id,
			date: new Date(),
			time: "8:00",
			purchase_option: PuchaseOptions.MORTAGE,
			status: BookingStatus.FAIL,
		},
	];

	await query.insert().into(BookingsEntity).values(bookings).execute();
}

export async function down(query: QueryBuilder<object>) {
	await query.delete().from(BookingsEntity).execute();
}
