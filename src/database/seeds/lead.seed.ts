import { DataSource, QueryBuilder } from "typeorm";

import { chunkArray } from "../../lib/array";
import { BuildingEntity } from "../../modules/buildings/buildings.entity";
import { ClientEntity } from "../../modules/client/client.entity";
import {
	LeadOpStatus,
	LeadOpsEntity,
} from "../../modules/leads/lead_ops.entity";
import { LeadState, LeadsEntity } from "../../modules/leads/leads.entity";
import { PremiseEntity } from "../../modules/premises/premises.entity";

import { faker } from "./faker";

type ILeadsEntity = Omit<
	LeadsEntity,
	| "id"
	| "ext_id"
	| "client"
	| "agent"
	| "project"
	| "premise"
	| "created_at"
	| "updated_at"
	| "is_active"
	| "start_date"
	| "status_updated_at"
>;
type ILeadOpsEntity = Omit<
	LeadOpsEntity,
	"id" | "ext_id" | "lead" | "created_at" | "updated_at" | "is_active"
>;

const successLeads = [
	LeadOpStatus.OPEN,
	LeadOpStatus.INTEREST_IN_PURCHASING,
	LeadOpStatus.PRESENTATION,
	LeadOpStatus.BOOKED,
	LeadOpStatus.REQUEST_FOR_CONTRACT,
	LeadOpStatus.CONTRACT_IS_REGISTERED,
	LeadOpStatus.WON,
];

const canceledLeads = [
	LeadOpStatus.OPEN,
	LeadOpStatus.INTEREST_IN_PURCHASING,
	LeadOpStatus.PRESENTATION,
	LeadOpStatus.BOOKED,
	LeadOpStatus.BOOK_CANCELED,
];

const lostLeads = [
	LeadOpStatus.OPEN,
	LeadOpStatus.INTEREST_IN_PURCHASING,
	LeadOpStatus.PRESENTATION,
	LeadOpStatus.BOOKED,
	LeadOpStatus.LOST_BOOK,
];

const pauseLeads = [
	LeadOpStatus.OPEN,
	LeadOpStatus.INTEREST_IN_PURCHASING,
	LeadOpStatus.PRESENTATION,
	LeadOpStatus.ON_PAUSE,
];

const failedLeads = [
	LeadOpStatus.OPEN,
	LeadOpStatus.INTEREST_IN_PURCHASING,
	LeadOpStatus.PRESENTATION,
	LeadOpStatus.BOOKED,
	LeadOpStatus.REQUEST_FOR_CONTRACT,
	LeadOpStatus.FAILED,
];

const leadOpStatusMap = new Map([
	[LeadOpStatus.WON, successLeads],
	[LeadOpStatus.BOOK_CANCELED, canceledLeads],
	[LeadOpStatus.LOST_BOOK, lostLeads],
	[LeadOpStatus.ON_PAUSE, pauseLeads],
	[LeadOpStatus.FAILED, failedLeads],
]);

function createLead(
	client_id: number,
	agent_id: number,
	project_id: number,
	premise_id: number,
): ILeadsEntity {
	const current_status = faker.helpers.arrayElement([
		LeadOpStatus.WON,
		LeadOpStatus.BOOK_CANCELED,
		LeadOpStatus.LOST_BOOK,
		LeadOpStatus.ON_PAUSE,
		LeadOpStatus.FAILED,
	]);
	let state = LeadState.ACTIVE;
	if (current_status === LeadOpStatus.FAILED) {
		state = LeadState.FAILED;
	}
	if (current_status === LeadOpStatus.WON) {
		state = LeadState.COMPLETE;
	}
	if (current_status === LeadOpStatus.ON_PAUSE) {
		state = LeadState.IN_PROGRESS;
	}
	const lead: ILeadsEntity = {
		client_id: client_id,
		agent_id: agent_id,
		project_id: project_id,
		premise_id: premise_id,
		current_status: current_status,
		lead_number: faker.string.numeric(7),
		state: state,
		fee: faker.number.int({ min: 100000, max: 999999 }),
		comment: faker.lorem.words({ min: 5, max: 10 }),
		sign_nps_passed: false,
	};
	return lead;
}

export async function up(
	query: QueryBuilder<object>,
	clients: ClientEntity[],
	buildings: BuildingEntity[],
	premises: PremiseEntity[],
): Promise<LeadsEntity[]> {
	const leads: ILeadsEntity[] = [];
	const leadOps: ILeadOpsEntity[] = [];

	clients.forEach((client) => {
		const premise = faker.helpers.arrayElement(premises);
		const building = buildings.find(
			(building) => building.id === premise.building_id,
		);
		if (building?.project_id) {
			const lead = createLead(
				client.id,
				client.agent_id,
				building.project_id,
				premise.id,
			);
			leads.push(lead);
		}
	});

	const leadChunks = chunkArray(leads, 50);

	const res: LeadsEntity[][] = [];
	for await (const chunk of leadChunks) {
		const { generatedMaps } = await query
			.insert()
			.into(LeadsEntity)
			.values(chunk)
			.returning("*")
			.execute();
		res.push(generatedMaps as LeadsEntity[]);
	}

	const createdLeads = res.flat();

	createdLeads.forEach((lead) => {
		const leadOpStatuses = leadOpStatusMap.get(lead.current_status);

		if (leadOpStatuses) {
			leadOpStatuses.forEach((leadOpStatus) => {
				leadOps.push({
					lead_id: lead.id,
					status: leadOpStatus,
				});
			});
		}
	});

	const leadOpsChunks = chunkArray(leadOps, 50);
	for await (const chunk of leadOpsChunks) {
		await query.insert().into(LeadOpsEntity).values(chunk).execute();
	}

	return createdLeads;
}

export async function down(dataSource: DataSource) {
	const leadTableName = dataSource.getMetadata(LeadOpsEntity).tableName;
	await dataSource.query(
		`TRUNCATE ${leadTableName} RESTART IDENTITY CASCADE;`,
	);

	const leadOpsTableName = dataSource.getMetadata(LeadsEntity).tableName;
	await dataSource.query(
		`TRUNCATE ${leadOpsTableName} RESTART IDENTITY CASCADE;`,
	);
}
