import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsSelect, IsNull, Repository } from "typeorm";

import { PickBySelect } from "interfaces/pick_by_select";

import { BaseDto, MetaLinkWithLeadState } from "../../common/base/base_dto";
import { RoleType } from "../../constants";
import { BuildingsService } from "../buildings/buildings.service";
import { ClientService } from "../client/client.service";
import { PremiseNotFoundError } from "../premises/errors/PremiseNotFound.error";
import { PremisesService } from "../premises/premises.service";
import { ProjectService } from "../projects/projects.service";
import { UserNotFoundError } from "../user/errors/UserNotFound.error";
import { UserService } from "../user/user.service";
import { NotificationService } from "../notification/notification.service";
import { NotificationType } from "../notification/notification.entity";
import { ICurrentUser } from "../../interfaces/current-user.interface";
import { UserEntity } from "../user/user.entity";

import { CreateLeadDto } from "./dtos/CreateLead.dto";
import { LeadReadByFilterDto } from "./dtos/LeadReadByFilter.dto";
import { LeadNotFoundError } from "./errors/LeadNotFound.error";
import { LeadOpStatus, LeadOpsEntity } from "./lead_ops.entity";
import { LeadState, LeadsEntity } from "./leads.entity";

export interface ReadAllData {
	state?: LeadState;
	data?: LeadsEntity[];
}

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
		private readonly notificationsService: NotificationService,
	) {}

	get repository(): Repository<LeadsEntity> {
		return this.leadRepository;
	}

	get opsRepository(): Repository<LeadOpsEntity> {
		return this.leadOpsRepository;
	}

	async create(lead: CreateLeadDto): Promise<LeadsEntity> {
		const foundPremises = await this.premisesService.readOneWithRelation(
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
		await this.clientService.checkExists(lead.client_id);
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

	async readAll(
		dto: LeadReadByFilterDto,
		user: ICurrentUser,
	): Promise<BaseDto<LeadsEntity[]>> {
		const metaData = BaseDto.create<LeadsEntity[]>();
		if (
			dto.is_finished &&
			dto.status &&
			!(
				dto.status === LeadOpStatus.WON ||
				dto.status === LeadOpStatus.FAILED
			)
		) {
			metaData.data = [];
			metaData.setPagination(0, dto.page, dto.limit);
			metaData.meta.data = {
				statuses: Object.values(LeadOpStatus),
			};

			return metaData;
		}

		const filter: { agent?: object } = {};

		if (user.role === RoleType.AGENT) {
			filter.agent = {
				id: user.user_id,
			};
		} else if (user.role === RoleType.HEAD_OF_AGENCY) {
			const foundUser = await this.userService.readOne(user.user_id, {
				agency_id: true,
			});

			filter.agent = { agency_id: foundUser.agency_id };
		}

		const [leads, leadsCount] = await this.leadRepository.findAndCount({
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
				...filter,
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

		metaData.data = leads;
		metaData.setPagination(leadsCount, dto.page, leads.length);
		metaData.meta.data = {
			statuses: [
				LeadOpStatus.INTEREST_IN_PURCHASING,
				LeadOpStatus.PRESENTATION,
				LeadOpStatus.BOOKED,
				LeadOpStatus.REQUEST_FOR_CONTRACT,
				LeadOpStatus.CONTRACT_IS_REGISTERED,
				LeadOpStatus.BOOK_CANCELED,
				LeadOpStatus.LOST_BOOK,
			],
		};

		return metaData;
	}

	async readAllV2(
		dto: LeadReadByFilterDto,
		user: ICurrentUser,
	): Promise<BaseDto<LeadsEntity[]>> {
		const pageSize = (dto.page - 1) * dto.limit;

		const metaData = BaseDto.create<LeadsEntity[]>();
		if (
			dto.is_finished &&
			dto.status &&
			!(
				dto.status === LeadOpStatus.WON ||
				dto.status === LeadOpStatus.FAILED
			)
		) {
			metaData.data = [];
			metaData.setPagination(0, dto.page, dto.limit);
			metaData.meta.data = {
				statuses: Object.values(LeadOpStatus),
			};

			return metaData;
		}

		const filter: { agent?: object; state?: LeadState } = {};

		if (user.role === RoleType.AGENT) {
			filter.agent = {
				id: user.user_id,
			};
		} else if (user.role === RoleType.HEAD_OF_AGENCY) {
			const foundUser = await this.userService.readOne(user.user_id, {
				agency_id: true,
			});

			filter.agent = { agency_id: foundUser.agency_id };
		}

		if (dto.state) {
			filter.state = dto.state;
		}

		const [leads, leadsCount] = await this.leadRepository.findAndCount({
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
				...filter,
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
				created_at: dto.createdAt ?? "ASC",
			},
			take: dto.limit,
			skip: pageSize,
		});

		metaData.data = leads;
		metaData.setPagination(leadsCount, dto.page, leads.length);
		metaData.meta.data = {
			statuses: [
				LeadOpStatus.INTEREST_IN_PURCHASING,
				LeadOpStatus.PRESENTATION,
				LeadOpStatus.BOOKED,
				LeadOpStatus.REQUEST_FOR_CONTRACT,
				LeadOpStatus.CONTRACT_IS_REGISTERED,
				LeadOpStatus.BOOK_CANCELED,
				LeadOpStatus.LOST_BOOK,
			],
		};

		return metaData;
	}

	async readAllV3(
		dto: LeadReadByFilterDto,
		user: ICurrentUser,
	): Promise<BaseDto<(LeadsEntity | ReadAllData)[]>> {
		const pageSize = (dto.page - 1) * dto.limit;

		const metaData = BaseDto.create<LeadsEntity[]>();

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const filter: { agent?: object; state?: any } = {};

		if (user.role === RoleType.AGENT) {
			filter.agent = {
				id: user.user_id,
			};
		} else if (user.role === RoleType.HEAD_OF_AGENCY) {
			const foundUser = await this.userService.readOne(user.user_id, {
				agency_id: true,
			});

			filter.agent = { agency_id: foundUser.agency_id };
		}

		if (dto.is_initial) {
			const response: ReadAllData[] = [];
			const links: MetaLinkWithLeadState[] = [];

			if (!dto.is_finished) {
				await Promise.all(
					[LeadState.ACTIVE, LeadState.IN_PROGRESS].map(
						async (state) => {
							const [leads, leadsCount] =
								await this.leadRepository.findAndCount({
									select: {
										id: true,
										is_active: true,
										created_at: true,
										updated_at: true,
										is_has_task: true,
										client_id: true,
										agent_id: true,
										premise_id: true,
										project_id: true,
										manager_id: true,
										comment: true,
										fee: true,
										current_status: true,
										sign_nps_passed: true,
										lead_number: true,
										start_date: true,
										state: true,
										status_updated_at: true,
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
										...filter,
										state,
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
										created_at: dto.createdAt ?? "ASC",
									},
									take: dto.limit,
									skip: pageSize,
								});

							const metaData = BaseDto.create<LeadsEntity[]>();

							metaData.setPagination(
								leadsCount,
								dto.page,
								dto.limit,
							);

							response.push({ state, data: leads });
							links.push({
								state,
								...metaData.getPagination(),
							});
						},
					),
				);
			} else {
				await Promise.all(
					[LeadState.COMPLETE, LeadState.FAILED].map(
						async (state) => {
							const [leads, leadsCount] =
								await this.leadRepository.findAndCount({
									select: {
										id: true,
										is_active: true,
										created_at: true,
										updated_at: true,
										is_has_task: true,
										client_id: true,
										agent_id: true,
										premise_id: true,
										project_id: true,
										manager_id: true,
										comment: true,
										fee: true,
										current_status: true,
										sign_nps_passed: true,
										lead_number: true,
										start_date: true,
										state: true,
										status_updated_at: true,
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
										...filter,
										state,
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
										created_at: dto.createdAt ?? "ASC",
									},
									take: dto.limit,
									skip: pageSize,
								});

							const metaData = BaseDto.create<LeadsEntity[]>();

							metaData.setPagination(
								leadsCount,
								dto.page,
								dto.limit,
							);

							response.push({ state, data: leads });
							links.push({
								state,
								...metaData.getPagination(),
							});
						},
					),
				);
			}

			const metaData = BaseDto.create<ReadAllData[]>();
			metaData.data = response;
			metaData.meta.data = {
				statuses: [
					LeadOpStatus.INTEREST_IN_PURCHASING,
					LeadOpStatus.PRESENTATION,
					LeadOpStatus.BOOKED,
					LeadOpStatus.REQUEST_FOR_CONTRACT,
					LeadOpStatus.CONTRACT_IS_REGISTERED,
					LeadOpStatus.BOOK_CANCELED,
					LeadOpStatus.LOST_BOOK,
				],
			};
			metaData.setLinks(links);

			return metaData;
		}

		if (dto.state) {
			filter.state = dto.state;
		}

		const [leads, leadsCount] = await this.leadRepository.findAndCount({
			select: {
				id: true,
				is_active: true,
				created_at: true,
				updated_at: true,
				is_has_task: true,
				client_id: true,
				agent_id: true,
				premise_id: true,
				project_id: true,
				manager_id: true,
				comment: true,
				fee: true,
				current_status: true,
				sign_nps_passed: true,
				lead_number: true,
				start_date: true,
				state: true,
				status_updated_at: true,
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
				...filter,
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
				created_at: dto.createdAt ?? "ASC",
			},
			take: dto.limit,
			skip: pageSize,
		});

		metaData.data = leads;
		metaData.setPagination(leadsCount, dto.page, leads.length);
		metaData.meta.data = {
			statuses: [
				LeadOpStatus.INTEREST_IN_PURCHASING,
				LeadOpStatus.PRESENTATION,
				LeadOpStatus.BOOKED,
				LeadOpStatus.REQUEST_FOR_CONTRACT,
				LeadOpStatus.CONTRACT_IS_REGISTERED,
				LeadOpStatus.BOOK_CANCELED,
				LeadOpStatus.LOST_BOOK,
			],
		};

		return metaData;
	}

	async readOne(id: number) {
		const lead = await this.leadRepository.findOne({
			where: { id },
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
			relations: {
				lead_ops: true,
				premise: true,
				manager: true,
				agent: true,
				client: true,
				project: true,
			},
		});

		if (!lead) {
			throw new LeadNotFoundError(`id: ${id}`);
		}

		return lead;
	}

	async viewNPS(id: number, user: ICurrentUser) {
		const lead = await this.leadRepository.findOneBy({ id });

		if (!lead) {
			throw new LeadNotFoundError(`id: ${id}`);
		}

		const notification =
			await this.notificationsService.readOneByObjectIdAndType(
				lead.id,
				NotificationType.END_LEAD,
			);

		await this.notificationsService.readNotification(notification.id, user);

		lead.sign_nps_passed = true;
		await this.leadRepository.save(lead);

		return lead;
	}

	async changeStatus(
		leadId: number,
		toStatus: LeadOpStatus,
	): Promise<[LeadsEntity, number]> {
		const foundLead = await this.leadRepository.findOne({
			select: {
				premise: {
					price: true,
					size: true,
				},
			},
			relations: {
				premise: true,
			},
			where: {
				id: leadId,
			},
		});

		if (!foundLead) {
			throw new LeadNotFoundError(`lead id: ${leadId}`);
		}

		const users: Array<Pick<UserEntity, "id" | "firebase_token">> = [];

		if (foundLead.manager_id) {
			const manager = await this.userService.readOne(
				foundLead.manager_id,
				{ id: true, firebase_token: true },
			);

			users.push({
				id: manager.id,
				firebase_token: manager.firebase_token,
			});
		}

		const agent = await this.userService.readOne(foundLead.agent_id, {
			id: true,
			firebase_token: true,
		});

		users.push({ id: agent.id, firebase_token: agent.firebase_token });

		if (toStatus === LeadOpStatus.ON_PAUSE) {
			await this.leadRepository.update(leadId, {
				state: LeadState.IN_PROGRESS,
			});
		} else if (toStatus === LeadOpStatus.FAILED) {
			await this.leadRepository.update(leadId, {
				state: LeadState.FAILED,
			});
		} else if (toStatus === LeadOpStatus.BOOK_CANCELED) {
			await this.notificationsService.sendToUsers(users, {
				object_id: leadId,
				type: NotificationType.END_LEAD,
				title: `LEAD ${leadId}`,
				description: `Статус LEAD ${leadId} изменен на ${LeadOpStatus.BOOK_CANCELED}`,
			});
			await this.leadRepository.update(leadId, {
				state: LeadState.FAILED,
			});
		} else if (toStatus === LeadOpStatus.WON) {
			await this.notificationsService.sendToUsers(users, {
				object_id: leadId,
				type: NotificationType.END_LEAD,
				title: `LEAD ${leadId}`,
				description: `Статус LEAD ${leadId} изменен на ${LeadOpStatus.WON}`,
			});
			await this.leadRepository.update(leadId, {
				state: LeadState.COMPLETE,
			});
		}
		await this.leadRepository.update(foundLead.id, {
			current_status: toStatus,
		});
		foundLead.current_status = toStatus;
		let newLeadOP = this.leadOpsRepository.create();
		newLeadOP.lead_id = leadId;
		newLeadOP.status = toStatus;
		newLeadOP = await this.leadOpsRepository.save(newLeadOP);
		const leadsCount = await this.leadRepository.countBy({
			agent_id: foundLead.agent_id,
		});
		return [foundLead, leadsCount];
	}

	async readOneByExtId<T extends FindOptionsSelect<LeadsEntity>>(
		ext_id: string,
		select?: T,
	): Promise<PickBySelect<LeadsEntity, T>> {
		const client = await this.leadRepository.findOne({
			select: select,
			where: { ext_id: ext_id },
		});
		if (!client) {
			throw new LeadNotFoundError(`ext_id: ${ext_id}`);
		}
		return client;
	}

	async readOneByClientId<T extends FindOptionsSelect<LeadsEntity>>(
		client_id: number,
		select?: T,
	): Promise<LeadsEntity> {
		const client = await this.leadRepository.findOne({
			select: select,
			where: { client_id: client_id },
		});

		if (!client) {
			throw new LeadNotFoundError(`client_id: ${client_id}`);
		}

		return client;
	}
}
