import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";

import { BaseDto } from "../../common/base/base_dto";
import { RoleType } from "../../constants";
import { BuildingsService } from "../buildings/buildings.service";
import { ClientService } from "../client/client.service";
import { PremiseNotFoundError } from "../premises/errors/PremiseNotFound.error";
import { PremisesService } from "../premises/premises.service";
import { ProjectService } from "../projects/projects.service";
import { UserNotFoundError } from "../user/errors/UserNotFound.error";
import { UserService } from "../user/user.service";

import { CreateLeadDto } from "./dtos/CreateLead.dto";
import { LeadReadByFilterDto } from "./dtos/LeadReadByFilter.dto";
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
		private readonly prjectService: ProjectService,
		private readonly premisesService: PremisesService,
		private readonly buildingsService: BuildingsService,
		private readonly userService: UserService,
	) {}

	async create(lead: CreateLeadDto): Promise<LeadsEntity> {
		const foundPremises = await this.premisesService.readOne(
			lead.premise_id,
		);
		if (!foundPremises.id) {
			throw new PremiseNotFoundError(`premise_id: ${lead.premise_id}`);
		}
		const foundBuilding = await this.buildingsService.readOne(
			foundPremises.building_id!,
		);
		const foundProject = await this.prjectService.readOne(
			foundBuilding.project_id,
		);
		await this.clientService.readOne(lead.client_id);
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

	async readAll(dto: LeadReadByFilterDto): Promise<BaseDto<LeadsEntity[]>> {
		const leads = await this.leadRepository.find({
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
					type: true,
					rooms: true,
					floor: true,
					price: true,
				},
				lead_ops: {
					id: true,
					status: true,
				},
			},
			where: {
				project_id: dto.project_id,
				premise: {
					type: dto.premise_type,
				},
				client: {
					id: dto.client_id,
				},
				current_status: dto.status,
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
					id: "ASC",
				},
				created_at: dto.createdAt ?? "ASC",
			},
		});

		const leadsCount = await this.leadRepository.count();

		const metaData = BaseDto.create<LeadsEntity[]>();
		metaData.data = leads;
		metaData.setPagination(leadsCount, dto.page, dto.limit);
		return metaData;
	}

	async changeStatus(leadId: number, toStatus: LeadOpStatus) {
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
		await this.leadRepository.update(leadId, {
			current_status: toStatus,
		});
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
