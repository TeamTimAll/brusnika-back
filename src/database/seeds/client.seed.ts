import { QueryBuilder } from "typeorm";

import {
	ClientEntity,
	ConfirmationType,
	FixingType,
} from "../../modules/client/client.entity";
import { UserEntity } from "../../modules/user/user.entity";

export async function up(query: QueryBuilder<object>) {
	const [agent] = await query
		.select("id")
		.from(UserEntity, "u")
		.where("email = :email", {
			email: "jondoeagent@gmail.com",
		})
		.getRawMany<UserEntity>();

	const clients: Omit<
		ClientEntity,
		| "id"
		| "leads"
		| "agent"
		| "bookings"
		| "visits"
		| "created_at"
		| "updated_at"
		| "is_active"
	>[] = [
		{
			fullname: "Ivan Petrovich Ivanov",
			phone_number: "71234567890",
			actived_date: new Date(),
			comment: "очень классно",
			fixing_type: FixingType.LEAD_VERIFICATION,
			expiration_date: new Date(),
			node: "очень хороший клиент",
			agent_id: agent.id,
			confirmation_type: ConfirmationType.PHONE,
		},
		{
			fullname: "Dmitry Sergeevich Smirnov",
			phone_number: "71234567891",
			actived_date: new Date(),
			comment: "очень классно",
			fixing_type: FixingType.LEAD_VERIFICATION,
			expiration_date: new Date(),
			node: "очень хороший клиент",
			agent_id: agent.id,
			confirmation_type: ConfirmationType.PHONE,
		},
		{
			fullname: "Alexei Nikolaevich Sokolov",
			phone_number: "71234567892",
			actived_date: new Date(),
			comment: "очень классно",
			fixing_type: FixingType.LEAD_VERIFICATION,
			expiration_date: new Date(),
			node: "очень хороший клиент",
			agent_id: agent.id,
			confirmation_type: ConfirmationType.PHONE,
		},
		{
			fullname: "Nikolai Andreevich Popov",
			phone_number: "71234567893",
			actived_date: new Date(),
			comment: "очень классно",
			fixing_type: FixingType.LEAD_VERIFICATION,
			expiration_date: new Date(),
			node: "очень хороший клиент",
			agent_id: agent.id,
			confirmation_type: ConfirmationType.PHONE,
		},
		{
			fullname: "Sergey Vladimirovich Vasiliev",
			phone_number: "71234567894",
			actived_date: new Date(),
			comment: "очень классно",
			fixing_type: FixingType.LEAD_VERIFICATION,
			expiration_date: new Date(),
			node: "очень хороший клиент",
			agent_id: agent.id,
			confirmation_type: ConfirmationType.PHONE,
		},
	];

	await query.insert().into(ClientEntity).values(clients).execute();
}

export async function down(query: QueryBuilder<object>) {
	await query.delete().from(ClientEntity).execute();
}
