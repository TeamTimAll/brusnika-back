import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";

import { BaseDto } from "../../common/base/base_dto";
import { ICurrentUser } from "../../interfaces/current-user.interface";
import { LeadOpsEntity } from "../leads/lead_ops.entity";
import { LeadsEntity } from "../leads/leads.entity";

import { ClientEntity, ClientTag } from "./client.entity";
import { ClientDto } from "./dto/Client.dto";
import { ClientSearchFromBmpsoftDto } from "./dto/ClientSearchFromBmpsoft.dto";
import { DeleteClientDto } from "./dto/DeleteClient.dto";
import { FilterClientDto } from "./dto/FilterClient.dto";
import { ClientNotFoundError } from "./errors/ClientNotFound.error";

@Injectable()
export class ClientService {
	constructor(
		@InjectRepository(ClientEntity)
		private clientRepository: Repository<ClientEntity>,
	) {}

	get repository(): Repository<ClientEntity> {
		return this.clientRepository;
	}

	create(dto: ClientDto) {
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
				"(c.agent_id = :client_agent_id OR c.status = :client_status)",
				{
					client_agent_id: user.user_id,
					client_status: ClientTag.WEAK_FIXING,
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
		return this.clientRepository.findOne({
			where: {
				fullname: ILike(`%${dto.fullname}%`),
				phone_number: dto.phone_number,
			},
		});
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
				"c.status as status",
				"c.expiration_date as expiration_date",
				"c.node as node",
				"COALESCE(JSON_AGG(l) FILTER (WHERE l.id IS NOT NULL), '[]') as leads",
			])
			.leftJoin(
				(qb) => {
					const query = qb
						.select("l.*")
						.addSelect("lop.status")
						.addSelect(
							"JSON_BUILD_OBJECT('id', p.id, 'name', p.name) as project",
						)
						.from(LeadsEntity, "l")
						.leftJoin("projects", "p", "p.id = l.project_id")
						.innerJoin(
							(qb2) => {
								const query = qb2
									.select("*")
									.from(LeadOpsEntity, "lop")
									.where("l.id = lop.lead_id")
									.orderBy("lop.created_at", "DESC")
									.limit(1)
									.getQuery();
								qb2.getQuery = () => `LATERAL (${query})`;
								return qb2;
							},
							"lop",
							"l.id = lop.lead_id",
						)
						.where("l.client_id = c.id")
						.groupBy("l.id")
						.addGroupBy("lop.status")
						.addGroupBy("p.id")
						.limit(1)
						.getQuery();

					qb.getQuery = () => `LATERAL (${query})`;
					return qb;
				},
				"l",
				"c.id = l.client_id",
			)
			.where(
				"(c.agent_id = :client_agent_id or c.status = :client_status)",
				{
					client_agent_id: user.user_id,
					client_status: ClientTag.WEAK_FIXING,
				},
			)
			.groupBy("c.id");

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
			queryBuilder = queryBuilder.andWhere("l.status = :status", {
				status: dto.status,
			});
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
					status: ClientTag.WEAK_FIXING,
				},
			],
		});

		const metaData = BaseDto.create<ClientEntity[]>();
		metaData.calcPagination(clientCount, dto.page, dto.limit);
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
