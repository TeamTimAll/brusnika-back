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
import {
	ExchangeRequestOpsEntity,
	ExchangeRequestStatus,
} from "./exchange-request-ops.entity";

@Injectable()
export class ExchangeRequestService {
	constructor(
		@InjectRepository(ExchangeRequestEntity)
		private exchangeRequestRepository: Repository<ExchangeRequestEntity>,
		@InjectRepository(ExchangeRequestOpsEntity)
		private exchangeRequestOpsRepository: Repository<ExchangeRequestOpsEntity>,
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

		const newRequest =
			await this.exchangeRequestRepository.save(exchangeRequest);

		let newOps = this.exchangeRequestOpsRepository.create({
			exchange_request_id: newRequest.id,
		});

		newOps = await this.exchangeRequestOpsRepository.save(newOps);

		const mergedRequest = this.exchangeRequestRepository.merge(newRequest, {
			exchange_request_ops: [newOps],
		});

		const updatedRequest =
			await this.exchangeRequestRepository.save(mergedRequest);

		return updatedRequest;
	}

	async readOne(id: number) {
		const findOne = await this.exchangeRequestRepository.findOne({
			relations: {
				client: true,
				agent: true,
				exchange_request_ops: true,
			},
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
			relations: {
				client: true,
				agent: true,
				exchange_request_ops: true,
			},
			where: {
				client_id,
				premise_type,
				state,
			},
			order: {
				exchange_request_ops: {
					id: "ASC",
				},
				created_at: dto.createdAt ?? "ASC",
			},
		});

		return exchangeRequestQuery;
	}

	async changeStatus(id: number, status: ExchangeRequestStatus) {
		const data = await this.readOne(id);

		let newRequestOps = this.exchangeRequestOpsRepository.create();

		const state =
			status === ExchangeRequestStatus.FAILED
				? ExchangeRequestState.FAILED
				: ExchangeRequestState.ACTIVE;

		await this.exchangeRequestRepository.update(
			{ id },
			{
				current_status: status,
				state,
			},
		);

		newRequestOps.exchange_request_id = id;
		newRequestOps.status = status;
		newRequestOps =
			await this.exchangeRequestOpsRepository.save(newRequestOps);

		return data;
	}
}
