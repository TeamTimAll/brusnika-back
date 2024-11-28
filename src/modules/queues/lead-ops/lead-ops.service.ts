import { Injectable } from "@nestjs/common";

import { LeadsService } from "../../leads/leads.service";

import { LeadOpsDto, LeadOpsesDto } from "./dto";

@Injectable()
export class LeadOpsQueueService {
	constructor(private readonly leadService: LeadsService) {}

	async createOrUpdateLeadOps(ops: LeadOpsDto) {
		const lead = await this.leadService.readOneByExtId(ops.lead_ext_id);

		const foundOps = await this.leadService.leadOpsRepository.findOne({
			where: { lead_id: lead.id, status: ops.status },
		});

		if (!foundOps) {
			return await this.leadService.opsRepository
				.createQueryBuilder()
				.insert()
				.values({
					ext_id: ops.ext_id,
					lead_id: lead.id,
					status: ops.status,
					created_at: ops.created_at,
				})
				.execute();
		} else {
			return await this.leadService.opsRepository
				.createQueryBuilder()
				.update()
				.set({
					lead_id: lead.id,
					status: ops.status,
					created_at: ops.created_at,
				})
				.where("id = :id", { id: foundOps.id })
				.execute();
		}
	}

	async createLeadOpses({ data: ops }: LeadOpsesDto) {
		for await (const lead of ops) {
			await this.createOrUpdateLeadOps(lead);
		}
	}
}
