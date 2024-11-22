import { LeadOpStatus } from "../../../leads/lead_ops.entity";
import { LeadState } from "../../../leads/leads.entity";

export interface ILead {
	ext_id: string;
	client_id: number;
	agent_id: number;
	manager_id?: number;
	comment?: string;
	current_status: LeadOpStatus;
	premise_id: number;
	lead_number: string;
	project_id: number;
	fee: number;
	state: LeadState;
}
