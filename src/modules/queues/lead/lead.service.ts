import { BadRequestException, Injectable } from "@nestjs/common";

import { ClientService } from "../../client/client.service";
import { UserService } from "../../user/user.service";
import { UserEntity } from "../../user/user.entity";
import { ProjectService } from "../../projects/projects.service";
import { PremisesService } from "../../premises/premises.service";
import { LeadsService } from "../../leads/leads.service";
import { LeadOpStatus } from "../../leads/lead_ops.entity";

import { LeadDto, LeadsDto } from "./dto";
import { ILead } from "./types";

@Injectable()
export class LeadQueueService {
	constructor(
		private readonly userService: UserService,
		private readonly clientService: ClientService,
		private readonly projectService: ProjectService,
		private readonly premiseService: PremisesService,
		private readonly leadService: LeadsService,
	) {}

	async createOrUpdateLead(lead: LeadDto) {
		const client = await this.clientService.readOneByExtId(
			lead.client_ext_id,
		);


		const agent = await this.userService.readOneByExtId(lead.agent_ext_id);
		let manager: Pick<UserEntity, "id"> | undefined | null;
		if (lead.manager_ext_id) {
			manager = await this.userService.readOneByExtWithoutErrorId(
				lead.manager_ext_id,
				{ id: true },
			);
		}
		let project: any = {id: 114};
		if(lead.project_ext_id)
		{
			try {
				const projectCheck = await this.projectService.readOneByExtId(
					lead.project_ext_id,
					{ id: true },
				);
				if(projectCheck) {
					project = projectCheck;
				}
			} catch (error) {
				console.error("not found project");
			}

		}

		const premise = await this.premiseService.readOneByExtId(
			lead.premise_ext_id,
			{ id: true },
		);

		return this.leadService.leadRepository
			.createQueryBuilder()
			.insert()
			.values({
				ext_id: lead.ext_id,
				client_id: client.id,
				agent_id: agent.id,
				manager_id: manager?.id,
				project_id: project.id,
				premise_id: premise.id,
				comment: lead.comment,
				fee: lead.fee,
				current_status:
					lead.current_status.toLowerCase() as LeadOpStatus,
				lead_number: lead.lead_number,
				state: lead.state,
				start_date: lead.start_date
			})
			.orUpdate(
				[
					"client_id",
					"agent_id",
					"manager_id",
					"project_id",
					"premise_id",
					"comment",
					"fee",
					"current_status",
					"lead_number",
					"state",
					"start_date"
				],
				["ext_id"],
			)
			.execute();
	}

	async createLeads({ data: leads }: LeadsDto) {
		const preparedValues: ILead[] = [];

		for await (const lead of leads) {
			const client = await this.clientService.readOneByExtId(
				lead.client_ext_id,
			);

			const agent = await this.userService.readOneByExtId(
				lead.agent_ext_id,
			);
			let manager: Pick<UserEntity, "id"> | undefined;
			if (lead.manager_ext_id) {
				manager = await this.userService.readOneByExtId(
					lead.manager_ext_id,
					{ id: true },
				);
			}
			const project = await this.projectService.readOneByExtId(
				lead.project_ext_id,
				{ id: true },
			);
			const premise = await this.premiseService.readOneByExtId(
				lead.premise_ext_id,
				{ id: true },
			);

			preparedValues.push({
				ext_id: lead.ext_id,
				agent_id: agent.id,
				client_id: client.id,
				current_status: lead.current_status,
				fee: lead.fee,
				lead_number: lead.lead_number,
				manager_id: manager?.id,
				premise_id: premise.id,
				project_id: project.id,
				state: lead.state,
				comment: lead.comment,
				start_date: lead.start_date
			});
		}

		if (preparedValues.length > 0) {
			return this.leadService.repository
				.createQueryBuilder()
				.insert()
				.values(preparedValues)
				.execute();
		} else {
			throw new BadRequestException("No valid project data to insert.");
		}
	}
}
