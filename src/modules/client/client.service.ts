import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

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

	readAll() {
		return this.clientRepository.find();
	}

	readByFilter(dto: FilterClientDto): Promise<ClientEntity[]> {
		let queryBuilder = this.clientRepository
			.createQueryBuilder("c")
			.select([
				"c.fullname as fullname",
				"c.phone_number as phone_number",
				"c.actived_date as actived_date",
				"c.comment as comment",
				"c.status as status",
				"c.expiration_date as expiration_date",
				"c.node as node",
			]);

		if (dto.fullname) {
			queryBuilder = queryBuilder.andWhere("c.fullname ilike :fullname", {
				fullname: `%${dto.fullname}%`,
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
		if (dto.project_id || dto.status) {
			queryBuilder = queryBuilder.leftJoin(
				(qb) => {
					const query = qb
						.select("l.*")
						.addSelect("json_agg(lop) as lead_ops")
						.from(LeadsEntity, "l")
						.innerJoin(
							(qb2) => {
								const query = qb2
									.select("*")
									.from(LeadOpsEntity, "lop")
									.where("l.id = lop.lead_id")
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
						.limit(1)
						.getQuery();

					qb.getQuery = () => `LATERAL (${query})`;
					return qb;
				},
				"l",
				"c.id = l.client_id",
			);

			if (dto.project_id) {
				queryBuilder = queryBuilder.andWhere(
					"l.project_id = :project_id",
					{
						project_id: dto.project_id,
					},
				);
			}
			if (dto.status) {
				queryBuilder = queryBuilder.andWhere(
					"l.lead_ops -> 0 ->> 'status' = :status",
					{ status: dto.status },
				);
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

		return queryBuilder.execute() as Promise<ClientEntity[]>;
	}
}
