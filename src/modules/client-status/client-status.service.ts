import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import {
	IClientCreateStatus,
	IClientStatusCreatedType,
} from "../../types/client.types";

import { ClientStatusEntity } from "./client-status.entity";

@Injectable()
export class ClientStatusService {
	constructor(
		@InjectRepository(ClientStatusEntity)
		private statusRepo: Repository<ClientStatusEntity>,
	) {}

	get repository(): Repository<ClientStatusEntity> {
		return this.statusRepo;
	}

	async createClientStatus(
		clientStatus: IClientCreateStatus,
	): Promise<IClientStatusCreatedType> {
		const newStatus = await this.statusRepo.save(clientStatus);

		const response: IClientStatusCreatedType = {
			success: true,
			clientStatus: newStatus,
		};

		return response;
	}
}
