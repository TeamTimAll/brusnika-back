import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ClientService } from "../client/client.service";
import { UserService } from "../user/user.service";
import { RoleType } from "../../constants";
import { UserNotFoundError } from "../user/errors/UserNotFound.error";

import { CreateExchangeRequestDto } from "./dto/create-exchange-request.dto";
import {
	ExchangeRequestEntity,
	ExchangeRequestState,
} from "./exchange-request.entity";
import { ExchangeRequestNotFoundError } from "./errors/exchange-request-not-found.error";
import { FilterExchangeRequestDto } from "./dto/filter-exchange-request.dto";

@Injectable()
export class ExchangeRequestService {
	constructor(
		@InjectRepository(ExchangeRequestEntity)
		private exchangeRequestRepository: Repository<ExchangeRequestEntity>,
		private readonly cliectService: ClientService,
		private readonly usersService: UserService,
	) {}

	async create(dto: CreateExchangeRequestDto) {
		await this.cliectService.checkExists(dto.client_id);

		const foundAgent = await this.usersService.checkExists(dto.agent_id);

		if (foundAgent.role !== RoleType.AGENT) {
			throw new UserNotFoundError(`agent(user) id: ${dto.agent_id}`);
		}

		const exchangeRequest = this.exchangeRequestRepository.create(dto);

		return await this.exchangeRequestRepository.save(exchangeRequest);
	}

	async readOne(id: number) {
		const findOne = await this.exchangeRequestRepository.findOne({
			relations: { client: true, agent: true },
			where: { id },
		});

		if (!findOne) {
			throw new ExchangeRequestNotFoundError(
				`'${id}' exchange request not found`,
			);
		}
		return findOne;
	}

	async readAll(
		dto: FilterExchangeRequestDto,
	): Promise<ExchangeRequestEntity[]> {
		const { client_id, premise_type, state } = dto;
		const exchangeRequestQuery = await this.exchangeRequestRepository.find({
			relations: { client: true, agent: true },
			where: {
				client_id,
				premise_type,
				state,
			},
			order: { created_at: "ASC" },
		});

		return exchangeRequestQuery;
	}

	async changeStatus(id: number, state: ExchangeRequestState) {
		const data = await this.readOne(id);

		await this.exchangeRequestRepository.update(
			{
				id,
			},
			{ state },
		);

		data.state = state;

		return data;
	}
}
