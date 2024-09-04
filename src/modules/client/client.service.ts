import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";

import { BaseDto } from "../../common/base/base_dto";
import { RoleType } from "../../constants";
import { ICurrentUser } from "../../interfaces/current-user.interface";
import { LeadsEntity } from "../leads/leads.entity";
import { UserEntity } from "../user/user.entity";
import { UserService } from "../user/user.service";

import { ClientEntity, FixingType } from "./client.entity";
import { ClientSearchFromBmpsoftDto } from "./dto/ClientSearchFromBmpsoft.dto";
import { CreateClientDto } from "./dto/CreateClient.dto";
import { DeleteClientDto } from "./dto/DeleteClient.dto";
import { FilterClientDto } from "./dto/FilterClient.dto";
import { ClientNotFoundError } from "./errors/ClientNotFound.error";

@Injectable()
export class ClientService {
	constructor(
		@InjectRepository(ClientEntity)
		private clientRepository: Repository<ClientEntity>,
		private userService: UserService,
	) {}

	get repository(): Repository<ClientEntity> {
		return this.clientRepository;
	}

	create(dto: CreateClientDto) {
		const client = this.clientRepository.create(dto);
		return this.clientRepository.save(client);
	}

	async readOne(id: number) {
		const foundClient = await this.clientRepository.findOne({
			where: {
				id: id,
			},
		});
		if (!foundClient) {
			throw new ClientNotFoundError(`id: ${id}`);
		}
		return foundClient;
	}

	async checkExists(id: number): Promise<void> {
		const foundClient = await this.clientRepository.existsBy({ id: id });
		if (!foundClient) {
			throw new ClientNotFoundError(`id: ${id}`);
		}
	}

	async quickSearch(text: string = "", user: ICurrentUser) {
		return this.clientRepository
			.createQueryBuilder("c")
			.select([
				"c.id",
				"c.fullname",
				"c.phone_number",
			] as `c.${keyof ClientEntity}`[])
			.limit(25)
			.where(
				"(c.agent_id = :client_agent_id OR c.fixing_type = :client_status)",
				{
					client_agent_id: user.user_id,
					client_status: FixingType.WEAK_FIXING,
				},
			)
			.andWhere(
				"(c.fullname ILIKE :fullname OR c.phone_number ILIKE :phone_number)",
				{
					fullname: `%${text}%`,
					phone_number: `%${text}%`,
				},
			)
			.getMany();
	}

	async searchFromBmpsoft(
		dto: ClientSearchFromBmpsoftDto,
		_user: ICurrentUser,
	) {
		// Replace this with BMPSoft request
		const foundClient = await this.clientRepository.findOne({
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
		});
		if (!foundClient) {
			throw new ClientNotFoundError(
				`fullname: ${dto.fullname}; phone_number: ${dto.phone_number}`,
			);
		}
		return foundClient;
	}

	async readAll(
		dto: FilterClientDto,
		user: ICurrentUser,
	): Promise<BaseDto<ClientEntity[]>> {
		let queryBuilder = this.clientRepository
			.createQueryBuilder("c")
			.select([
				"c.id as id",
				"c.fullname as fullname",
				"c.phone_number as phone_number",
				"c.actived_date as actived_date",
				"c.comment as comment",
				"c.fixing_type as fixing_type",
				"c.expiration_date as expiration_date",
				"c.node as node",
				"COALESCE(JSON_AGG(l) FILTER (WHERE l.id IS NOT NULL), '[]') as leads",
			])
			.leftJoin(
				(qb) => {
					const query = qb
						.select("l.*")
						.addSelect(
							"JSON_BUILD_OBJECT('id', p.id, 'name', p.name) as project",
						)
						.addSelect(
							"JSON_BUILD_OBJECT('id', p2.id, 'name', p2.name) as premise",
						)
						.from(LeadsEntity, "l")
						.leftJoin("projects", "p", "p.id = l.project_id")
						.leftJoin("premises", "p2", "p2.id = l.premise_id")
						.where("l.client_id = c.id")
						.groupBy("l.id")
						.addGroupBy("p.id")
						.addGroupBy("p2.id")
						.orderBy("l.id")
						.limit(5)
						.getQuery();

					qb.getQuery = () => `LATERAL (${query})`;
					return qb;
				},
				"l",
				"c.id = l.client_id",
			)
			.groupBy("c.id");

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
				"phone_number ilike :phone_number",
				{
					phone_number: `%${dto.phone_number}%`,
				},
			);
		}
		if (dto.state) {
			queryBuilder = queryBuilder.andWhere("l.state = :state", {
				state: dto.state,
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

		const pageSize = (dto.page - 1) * dto.limit;

		queryBuilder = queryBuilder.limit(dto.limit).offset(pageSize);

		const clientCount = await this.clientRepository.count({
			where: [
				{
					agent_id: user.user_id,
				},
				{
					fixing_type: FixingType.WEAK_FIXING,
				},
			],
		});

		const metaData = BaseDto.create<ClientEntity[]>();
		metaData.setPagination(clientCount, dto.page, dto.limit);
		metaData.data = await queryBuilder.getRawMany();
		return metaData;
	}

	async delete(
		dto: DeleteClientDto,
		user: ICurrentUser,
	): Promise<ClientEntity> {
		const foundClient = await this.clientRepository.findOne({
			select: {
				id: true,
			},
			where: {
				id: dto.client_id,
				agent_id: user.user_id,
			},
		});

		if (!foundClient) {
			throw new ClientNotFoundError(`id: ${dto.client_id}`);
		}

		await this.clientRepository.delete({ id: foundClient.id });
		return foundClient;
	}
}
