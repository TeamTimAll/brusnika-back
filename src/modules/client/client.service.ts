import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

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
			.createQueryBuilder("client")
			.select([
				"fullname",
				"phone_number",
				"actived_date",
				"comment",
				"status",
				"expiration_date",
				"node",
			]);

		if (dto.fullname) {
			queryBuilder = queryBuilder.andWhere(
				"client.fullname = :fullname",
				{
					fullname: dto.fullname,
				},
			);
		}
		if (dto.phone_number) {
			queryBuilder = queryBuilder.andWhere(
				"phone_number = :phone_number",
				{
					phone_number: dto.phone_number,
				},
			);
		}
		if (dto.project_id || dto.status) {
			queryBuilder.innerJoin("leads", "l");

			if (dto.project_id) {
				queryBuilder = queryBuilder.andWhere("l.project_id = :project_id", {
					project_id: dto.project_id,
				});
			}
			if (dto.status) {
				queryBuilder = queryBuilder.andWhere(
					"l.status = :status",
					{
						status: dto.status,
					},
				);
			}
		}
		if (dto.actived_from_date) {
			queryBuilder = queryBuilder.andWhere(
				"actived_date >= :actived_from_date",
				{
					actived_from_date: dto.actived_from_date,
				},
			);
		}
		if (dto.actived_to_date) {
			queryBuilder = queryBuilder.andWhere(
				"actived_date <= :actived_to_date",
				{
					actived_to_date: dto.actived_to_date,
				},
			);
		}

		return queryBuilder.execute() as Promise<ClientEntity[]>;
	}
}
