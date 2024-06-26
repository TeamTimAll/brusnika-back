import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";

import { Uuid } from "boilerplate.polyfill";

import { RoleType } from "../../constants";
import { BuildingsService } from "../buildings/buildings.service";
import { BuildingNotFoundError } from "../buildings/errors/BuildingNotFound.error";
import { ClientService } from "../client/client.service";
import { ClientNotFoundError } from "../client/errors/ClientNotFound.error";
import { PremiseNotFoundError } from "../premises/errors/PremiseNotFound.error";
import { PremisesService } from "../premises/premises.service";
import { ProjectNotFoundError } from "../projects/errors/ProjectNotFound.error";
import { ProjectsService } from "../projects/projects.service";
import { UserNotFoundError } from "../user/errors/UserNotFound.error";
import { UserService } from "../user/user.service";

import { CreateLeadDto } from "./dtos/leads.create.dto";
import { LeadReadByFilter } from "./dtos/leads.dto";
import { LeadNotFoundError } from "./errors/LeadNotFound.error";
import { LeadOpStatus, LeadOpsEntity } from "./lead_ops.entity";
import { LeadState, LeadsEntity } from "./leads.entity";

@Injectable()
export class LeadsService {
	constructor(
		// Repositories
		@InjectRepository(LeadsEntity)
		public readonly leadRepository: Repository<LeadsEntity>,
		@InjectRepository(LeadOpsEntity)
		public readonly leadOpsRepository: Repository<LeadOpsEntity>,

		// Services
		private readonly clientService: ClientService,
		private readonly prjectService: ProjectsService,
		private readonly premisesService: PremisesService,
		private readonly buildingsService: BuildingsService,
		private readonly userService: UserService,
	) {}

	async create(lead: CreateLeadDto): Promise<LeadsEntity> {
		const foundPremises = await this.premisesService.repository.findOne({
			where: {
				id: lead.premise_id,
			},
		});
		if (!foundPremises) {
			throw new PremiseNotFoundError(`premises id: ${lead.premise_id}`);
		}
		const foundBuilding = await this.buildingsService.repository.findOne({
			where: {
				id: foundPremises.building_id ?? IsNull(),
			},
		});
		if (!foundBuilding) {
			throw new BuildingNotFoundError(`premises id: ${foundPremises.id}`);
		}

		const foundProject = await this.prjectService.repository.findOne({
			where: {
				id: foundBuilding.project_id ?? IsNull(),
			},
		});
		if (!foundProject) {
			throw new ProjectNotFoundError(`building id: ${foundBuilding.id}`);
		}
		const foundClinet = await this.clientService.repository.findOne({
			where: {
				id: lead.client_id,
			},
		});
		if (!foundClinet) {
			throw new ClientNotFoundError(`clinet id: ${lead.client_id}`);
		}
		const foundAgent = await this.userService.repository.findOne({
			where: {
				id: lead.agent_id ?? IsNull(),
				role: RoleType.AGENT,
			},
		});
		if (!foundAgent) {
			throw new UserNotFoundError(`agent(user) id: ${lead.agent_id}`);
		}
		const foundManeger = await this.userService.repository.findOne({
			where: {
				id: lead.manager_id ?? IsNull(),
				role: RoleType.MANAGER,
			},
		});
		if (!foundManeger) {
			throw new UserNotFoundError(`manager(user) id: ${lead.manager_id}`);
		}

		lead.project_id = foundProject.id;

		const newLead = await this.leadRepository.save(lead);
		let newOps = this.leadOpsRepository.create({ lead_id: newLead.id });
		newOps = await this.leadOpsRepository.save(newOps);
		const mergedLead = this.leadRepository.merge(newLead, {
			lead_ops: [newOps],
		});
		const updatedLead = await this.leadRepository.save(mergedLead);
		return updatedLead;
	}

	readAll(dto: LeadReadByFilter): Promise<LeadsEntity[]> {
		return this.leadRepository.find({
			select: {
				project: {
					id: true,
					name: true,
				},
				client: {
					id: true,
					fullname: true,
					phone_number: true,
				},
				agent: {
					id: true,
					fullName: true,
				},
				manager: {
					id: true,
					fullName: true,
				},
				premise: {
					id: true,
					name: true,
					type: true,
					rooms: true,
					floor: true,
				},
				lead_ops: {
					id: true,
					status: true,
				},
			},
			where: {
				project_id: dto.project_id,
				premise_id: dto.premise_id,
				client: {
					fullname: dto.client_fullname,
				},
				lead_ops: {
					status: dto.status,
				},
			},
			relations: {
				lead_ops: true,
				client: true,
				agent: true,
				manager: true,
				premise: true,
				project: true,
			},
			order: {
				lead_ops: {
					createdAt: "DESC",
				},
				createdAt: dto.createdAt ?? "ASC",
			},
		});
	}

	async changeStatus(leadId: Uuid, toStatus: LeadOpStatus) {
		const foundLead = await this.leadRepository.findOne({
			where: {
				id: leadId,
			},
		});
		if (!foundLead) {
			throw new LeadNotFoundError(`lead id: ${leadId}`);
		}
		if (toStatus === LeadOpStatus.ON_PAUSE) {
			await this.leadRepository.update(leadId, {
				state: LeadState.IN_PROGRESS,
			});
		} else if (toStatus === LeadOpStatus.FAILED) {
			await this.leadRepository.update(leadId, {
				state: LeadState.FAILED,
			});
		} else if (toStatus === LeadOpStatus.BOOK_CANCELED) {
			await this.leadRepository.update(leadId, {
				state: LeadState.FAILED,
			});
		} else if (toStatus === LeadOpStatus.WON) {
			await this.leadRepository.update(leadId, {
				state: LeadState.COMPLETE,
			});
		}
		let newLeadOP = this.leadOpsRepository.create();
		newLeadOP.lead_id = leadId;
		newLeadOP.status = toStatus;
		newLeadOP = await this.leadOpsRepository.save(newLeadOP);
		return this.leadRepository.findOne({
			where: {
				id: leadId,
			},
		});
	}
}
