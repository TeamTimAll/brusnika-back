import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOptionsSelect, ILike, Repository } from "typeorm";

import { PickBySelect } from "interfaces/pick_by_select";

import { BaseDto } from "../../common/base/base_dto";
import { RoleType } from "../../constants";
import { ICurrentUser } from "../../interfaces/current-user.interface";
import { LeadsEntity, LeadState } from "../leads/leads.entity";
import { PremiseEntity } from "../premises/premises.entity";
import { ProjectEntity } from "../projects/project.entity";
import { ClientQueueService } from "../queues/client/client.service";
import { UserEntity } from "../user/user.entity";
import { UserService } from "../user/user.service";
import { BuildingEntity } from "../buildings/buildings.entity";

import { ClientEntity, FixingType } from "./client.entity";
import { ClientQuickSearchDto } from "./dto/ClientQuickSearch.dto";
import { ClientSearchFromBmpsoftDto } from "./dto/ClientSearchFromBmpsoft.dto";
import { CreateClientDto } from "./dto/CreateClient.dto";
import { DeleteClientDto } from "./dto/DeleteClient.dto";
import { FilterClientDto } from "./dto/FilterClient.dto";
import { ClientExistsError } from "./errors/ClientExists.error";
import { ClientNotFoundError } from "./errors/ClientNotFound.error";
import { ClientPendingError } from "./errors/client-pending.error";

@Injectable()
export class ClientService {
	constructor(
		@InjectRepository(ClientEntity)
		private clientRepository: Repository<ClientEntity>,
		private userService: UserService,
		@Inject(forwardRef(() => ClientQueueService))
		private clinetQueueService: ClientQueueService,
	) {}

	get repository(): Repository<ClientEntity> {
		return this.clientRepository;
	}

	async readOneByExtId<T extends FindOptionsSelect<ClientEntity>>(
		ext_id: string,
		select?: T,
	): Promise<PickBySelect<ClientEntity, T>> {
		const client = await this.clientRepository.findOne({
			select: select,
			where: { ext_id: ext_id },
		});
		if (!client) {
			throw new ClientNotFoundError(`ext_id: ${ext_id}`);
		}
		return client;
	}

	async create(dto: CreateClientDto) {
		const existClient = await this.clientRepository.findOneBy({
			phone_number: dto.phone_number,
			agent_id: dto.agent_id,
		});
		if (existClient?.fixing_type === FixingType.LEAD_VERIFICATION) {
			throw new ClientPendingError(
				`phone_number: ${dto.phone_number}; agent_id: ${dto.agent_id}`,
			);
		}
		if (existClient) {
			throw new ClientExistsError(
				`phone_number: ${dto.phone_number}; agent_id: ${dto.agent_id}`,
			);
		}
		let client = this.clientRepository.create(dto);
		client = await this.clientRepository.save(client);

		await this.clinetQueueService.send(
			await this.clinetQueueService.createFromEntity(client),
		);

		return client;
	}

	async checkExists(id: number): Promise<void> {
		const foundClient = await this.clientRepository.existsBy({ id: id });
		if (!foundClient) {
			throw new ClientNotFoundError(`id: ${id}`);
		}
	}

	async search(
		dto: ClientQuickSearchDto,
		user: ICurrentUser,
	): Promise<BaseDto<ClientEntity[]>> {
		let queryBuilder = this.clientRepository
			.createQueryBuilder("c")
			.leftJoin("leads", "l", "l.client_id = c.id")
			.select([
				"c.id",
				"c.fullname",
				"c.phone_number",
				"c.fixing_type",
				"c.expiration_date",
			] as `c.${keyof ClientEntity}`[])
			.addSelect(["l.state"]);

		if (user.role === RoleType.AGENT) {
			queryBuilder = queryBuilder.where("c.agent_id = :client_agent_id", {
				client_agent_id: user.user_id,
			});
		} else if (user.role === RoleType.HEAD_OF_AGENCY) {
			const foundUser = await this.userService.repository.findOne({
				select: { agency_id: true },
				where: { id: user.user_id },
			});
			queryBuilder = queryBuilder.where(
				(qb) =>
					"c.agent_id IN (" +
					qb
						.subQuery()
						.from(UserEntity, "u")
						.select("u.id")
						.where("u.agency_id = :agency_id", {
							agency_id: foundUser?.agency_id,
						})
						.getQuery() +
					")",
			);
		}

		if (dto.state) {
			if (dto.state === LeadState.ACTIVE) {
				queryBuilder = queryBuilder
					.andWhere("l.state = :state", {
						state: dto.state,
					})
					.andWhere("c.fixing_type != :fixing_type", {
						fixing_type: FixingType.CENCEL_FIXING,
					});
			} else {
				queryBuilder = queryBuilder.andWhere("l.state = :state", {
					state: dto.state,
				});
			}
		}

		if (dto.status) {
			queryBuilder = queryBuilder.andWhere("l.current_status = :status", {
				status: dto.status,
			});
		}

		if (dto.fixing_type) {
			queryBuilder = queryBuilder.andWhere(
				"c.fixing_type = :fixing_type_filter",
				{
					fixing_type_filter: dto.fixing_type,
				},
			);
		}

		if (dto.is_active) {
			queryBuilder = queryBuilder
				.andWhere("c.fixing_type != :fixing_type_cancel", {
					fixing_type_cancel: FixingType.CENCEL_FIXING,
				})
				.andWhere("(l.id IS NULL OR l.state NOT IN (:...statuses))", {
					statuses: [LeadState.IN_PROGRESS, LeadState.FAILED],
				});
		}

		queryBuilder = queryBuilder.andWhere(
			new Brackets((qb) =>
				qb
					.where("c.fullname ILIKE :fullname", {
						fullname: `%${dto.text}%`,
					})
					.orWhere("c.phone_number ILIKE :phone_number", {
						phone_number: `%${dto.text}%`,
					}),
			),
		);

		const pageSize = (dto.page - 1) * dto.limit;
		queryBuilder = queryBuilder.limit(dto.limit).offset(pageSize);
		const [clients, clientCount] = await queryBuilder.getManyAndCount();

		const metaData = BaseDto.create<ClientEntity[]>();
		metaData.setPagination(clientCount, dto.page, dto.limit);
		metaData.data = clients;
		return metaData;
	}

	async searchFromBmpsoft(
		dto: ClientSearchFromBmpsoftDto,
		_user: ICurrentUser,
	) {
		// Replace this with BMPSoft request
		return await this.clientRepository.findOne({
			select: {
				agent: {
					fullName: true,
				},
			},
			relations: {
				agent: true,
			},
			where: {
				fullname: ILike(`%${dto.fullname}%`),
				phone_number: dto.phone_number,
			},
			order: {
				fixing_type: 'ASC',
				created_at: 'DESC',
			},
		});
	}

	async readAll(
		dto: FilterClientDto,
		user: ICurrentUser,
	): Promise<BaseDto<ClientEntity[]>> {
		let queryBuilder = this.clientRepository
			.createQueryBuilder("c")
			.leftJoinAndMapMany(
				"c.leads",
				LeadsEntity,
				"l",
				"c.id = l.client_id",
			)
			.leftJoinAndMapOne(
				"l.project",
				ProjectEntity,
				"p",
				"p.id = l.project_id",
			)
			.leftJoinAndMapOne(
				"l.premise",
				PremiseEntity,
				"p2",
				"p2.id = l.premise_id",
			)
			.leftJoinAndMapOne(
				"l.manager",
				UserEntity,
				"m",
				"m.id = l.manager_id",
			)
			.leftJoinAndMapOne(
				"l.client",
				ClientEntity,
				"c2",
				"c2.id = l.client_id",
			)
			.leftJoinAndMapOne(
				"l.agent",
				UserEntity,
				"a",
				"a.id = l.manager_id",
			)
			.leftJoinAndMapOne("l.agent", UserEntity, "u", "u.id = l.agent_id")
			.leftJoinAndMapOne(
				"p2.building",
				BuildingEntity,
				"b",
				"b.id = p2.building_id",
			)
			.select([
				"c.id",
				"c.fullname",
				"c.phone_number",
				"c.actived_date",
				"c.created_at",
				"c.comment",
				"c.fixing_type",
				"c.expiration_date",
				"c.node",
			])
			.addSelect([
				"l.id",
				"l.client_id",
				"l.agent_id",
				"l.manager_id",
				"l.project_id",
				"l.premise_id",
				"l.fee",
				"l.current_status",
				"l.lead_number",
				"l.state",
				"l.created_at",
				"l.updated_at",
			])
			.addSelect(["p.id", "p.name"])
			.addSelect([
				"p2.id",
				"p2.name",
				"p2.type",
				"p2.floor",
				"p2.rooms",
				"p2.price",
			])
			.addSelect(["b.id", "b.name"])
			.addSelect(["u.id", "u.fullName"])
			.addSelect(["m.id", "m.fullName"])
			.addSelect(["a.id", "a.fullName"])
			.addSelect(["c2.id", "c2.fullname", "c2.phone_number"]);

		if (dto.sort_by) {
			queryBuilder = queryBuilder.orderBy(
				"c." + dto.sort_by,
				dto.order_by,
			);
		}

		if (user.role === RoleType.AGENT) {
			queryBuilder = queryBuilder.where("c.agent_id = :client_agent_id", {
				client_agent_id: user.user_id,
			});
		} else if (user.role === RoleType.HEAD_OF_AGENCY) {
			const foundUser = await this.userService.repository.findOne({
				select: { agency_id: true },
				where: { id: user.user_id },
			});
			queryBuilder = queryBuilder.where(
				(qb) =>
					"c.agent_id IN (" +
					qb
						.subQuery()
						.from(UserEntity, "u")
						.select("u.id")
						.where("u.agency_id = :agency_id", {
							agency_id: foundUser?.agency_id,
						})
						.getQuery() +
					")",
			);
		}

		if (dto.client_id) {
			queryBuilder = queryBuilder.andWhere("c.id = :client_id", {
				client_id: dto.client_id,
			});
		}

		if (dto.phone_number) {
			queryBuilder = queryBuilder.andWhere(
				"c.phone_number ILIKE :phone_number",
				{
					phone_number: `%${dto.phone_number}%`,
				},
			);
		}

		if (dto.is_active) {
			queryBuilder = queryBuilder
				.andWhere("c.fixing_type != :fixing_type_cancel", {
					fixing_type_cancel: FixingType.CENCEL_FIXING,
				})
				.andWhere("(l.id IS NULL OR l.state NOT IN (:...statuses))", {
					statuses: [LeadState.IN_PROGRESS, LeadState.FAILED],
				});
		}

		if (dto.project_id) {
			queryBuilder = queryBuilder.andWhere("l.project_id = :project_id", {
				project_id: dto.project_id,
			});
		}

		if (dto.status) {
			queryBuilder = queryBuilder.andWhere("l.current_status = :status", {
				status: dto.status,
			});
		}

		if (dto.fixing_type) {
			queryBuilder = queryBuilder.andWhere(
				"c.fixing_type = :fixing_type",
				{
					fixing_type: dto.fixing_type,
				},
			);
		}

		if (dto.actived_from_date) {
			queryBuilder = queryBuilder.andWhere(
				"c.actived_date >= :actived_from_date",
				{
					actived_from_date: dto.actived_from_date,
				},
			);
		}

		if (dto.actived_to_date) {
			queryBuilder = queryBuilder.andWhere(
				"c.actived_date <= :actived_to_date",
				{
					actived_to_date: dto.actived_to_date,
				},
			);
		}

		if (dto.expiration_date) {
			queryBuilder = queryBuilder.andWhere(
				"c.expiration_date <= :expiration_date",
				{
					expiration_date: dto.expiration_date,
				},
			);
		}

		const pageSize = (dto.page - 1) * dto.limit;

		queryBuilder = queryBuilder.limit(dto.limit).offset(pageSize);

		const [clients, clientCount] = await queryBuilder.getManyAndCount();

		const metaData = BaseDto.create<ClientEntity[]>();
		metaData.setPagination(clientCount, dto.page, dto.limit);
		metaData.data = clients;
		return metaData;
	}

	async readOne(id: number, select?: FindOptionsSelect<ClientEntity>) {
		const foundClient = await this.clientRepository.findOne({
			select: select ? { id: true, ...select } : undefined, // NOTE: If id is not provided it returns null
			where: {
				id: id,
			},
		});
		if (!foundClient) {
			throw new ClientNotFoundError(`id: ${id}`);
		}
		return foundClient;
	}

	async readOneWithRelation(id: number) {
		const result = await this.clientRepository
			.createQueryBuilder("c")
			.leftJoinAndMapMany(
				"c.leads",
				LeadsEntity,
				"l",
				"c.id = l.client_id",
			)
			.leftJoinAndMapOne(
				"l.project",
				ProjectEntity,
				"p",
				"p.id = l.project_id",
			)
			.leftJoinAndMapOne(
				"l.premise",
				PremiseEntity,
				"p2",
				"p2.id = l.premise_id",
			)
			.leftJoinAndMapOne(
				"p2.building",
				BuildingEntity,
				"b",
				"b.id = p2.building_id",
			)
			.leftJoinAndMapOne("l.agent", UserEntity, "u", "u.id = l.agent_id")
			.select([
				"c.id",
				"c.fullname",
				"c.phone_number",
				"c.actived_date",
				"c.comment",
				"c.fixing_type",
				"c.expiration_date",
				"c.node",
			])
			.addSelect([
				"l.id",
				"l.client_id",
				"l.agent_id",
				"l.manager_id",
				"l.project_id",
				"l.premise_id",
				"l.fee",
				"l.current_status",
				"l.lead_number",
				"l.state",
				"l.created_at",
			])
			.addSelect(["p.id", "p.name"])
			.addSelect([
				"p2.id",
				"p2.name",
				"p2.type",
				"p2.floor",
				"p2.rooms",
				"p2.price",
			])
			.addSelect(["b.id", "b.name"])
			.addSelect(["u.id", "u.fullName"])
			.orderBy("l.id")
			.where("c.id = :id", { id })
			.getOne();

		if (!result) {
			throw new ClientNotFoundError();
		}

		return result;
	}

	async delete(dto: DeleteClientDto): Promise<ClientEntity> {
		const foundClient = await this.clientRepository.findOne({
			select: {
				id: true,
			},
			where: {
				id: dto.client_id,
			},
		});

		if (!foundClient) {
			throw new ClientNotFoundError(`id: ${dto.client_id}`);
		}

		await this.clientRepository.delete({ id: foundClient.id });
		return foundClient;
	}
}
