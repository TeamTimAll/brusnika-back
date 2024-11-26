import { Injectable } from "@nestjs/common";

import { LeadsService } from "../../leads/leads.service";

import { LeadOpsDto, LeadOpsesDto } from "./dto";

@Injectable()
export class LeadOpsQueueService {
	constructor(private readonly leadService: LeadsService) {}

	async createOrUpdateLeadOps(ops: LeadOpsDto) {
		const lead = await this.leadService.readOneByExtId(ops.lead_ext_id);

		return this.leadService.opsRepository
			.createQueryBuilder()
			.insert()
			.values({
				ext_id: ops.ext_id,
				lead_id: lead.id,
				status: ops.status,
				created_at: ops.created_at,
			})
			.orUpdate(["lead_id", "status", "created_at"], ["ext_id"])
			.execute();
	}

	async createLeadOpses({ data: ops }: LeadOpsesDto) {
		for await (const lead of ops) {
			await this.createOrUpdateLeadOps(lead);
		}
	}
}
