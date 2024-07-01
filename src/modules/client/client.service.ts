import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";

import { calcPagination } from "../../lib/pagination";
import { ServiceResponse } from "../../types";
import { LeadOpsEntity } from "../leads/lead_ops.entity";
import { LeadsEntity } from "../leads/leads.entity";

import { ClientEntity } from "./client.entity";
import { ClientDto } from "./dto/client.dto";
import { FilterClientDto } from "./dto/client.search.dto";

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

	quickSearch(fullname: string = "") {
		return this.clientRepository.find({
			select: {
				id: true,
				fullname: true,
				phone_number: true,
			},
			where: {
				fullname: ILike(`%${fullname}%`),
			},
			take: 25,
		});
	}

	async readAll(
		dto: FilterClientDto,
	): Promise<ServiceResponse<ClientEntity[]>> {
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
			]);

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
		if (dto.project_id || dto.status || dto.state) {
			queryBuilder = queryBuilder.innerJoin(
				(qb) => {
					const query = qb
						.select("l.*")
						.addSelect("lop.status")
						.from(LeadsEntity, "l")
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
						.limit(1)
						.getQuery();

					qb.getQuery = () => `LATERAL (${query})`;
					return qb;
				},
				"l",
				"c.id = l.client_id",
			);

			if (dto.state) {
				queryBuilder = queryBuilder.andWhere("l.state = :state", {
					state: dto.state,
				});
			}
			if (dto.project_id) {
				queryBuilder = queryBuilder.andWhere(
					"l.project_id = :project_id",
					{
						project_id: dto.project_id,
					},
				);
			}
			if (dto.status) {
				queryBuilder = queryBuilder.andWhere("l.status = :status", {
					status: dto.status,
				});
			}
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

		const clientCount = await this.clientRepository.count();

		const clientResponse: ServiceResponse<ClientEntity[]> = {
			links: calcPagination(clientCount, dto.page, dto.limit),
			data: (await queryBuilder.execute()) as ClientEntity[],
		};

		return clientResponse;
	}
}
