import { QueryBuilder } from "typeorm";

import { LeadOpStatus } from "../../modules/leads/lead_ops.entity";
import { LeadState, LeadsEntity } from "../../modules/leads/leads.entity";

export async function up(query: QueryBuilder<object>) {
	const leads: Omit<
		LeadsEntity,
		| "id"
		| "client"
		| "agent"
		| "project"
		| "premise"
		| "created_at"
		| "updated_at"
	>[] = [
		{
			client_id: 1,
			agent_id: 1,
			project_id: 1,
			premise_id: 1,
			current_status: LeadOpStatus.OPEN,
			lead_number: 0,
			state: LeadState.ACTIVE,
		},
	];

	await query.insert().into(LeadsEntity).values(leads).execute();
}

export async function down(query: QueryBuilder<object>) {
	await query.delete().from(LeadsEntity).execute();
}
