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
import { LeadOpStatus, LeadOpsEntity } from "./lead_ops.entity";
import { LeadsEntity } from "./leads.entity";

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
				id: lead.clinet_id,
			},
		});
		if (!foundClinet) {
			throw new ClientNotFoundError(`clinet id: ${lead.clinet_id}`);
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

	readAll() {
		return this.leadRepository.find({
			relations: {
				lead_ops: true,
			},
		});
	}

	changeStatus(leadId: Uuid, toStatus: LeadOpStatus) {
		leadId;
		toStatus;
	}
}
