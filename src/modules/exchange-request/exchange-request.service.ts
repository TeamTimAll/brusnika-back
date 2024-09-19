import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ClientService } from "../client/client.service";

import { CreateExchangeRequestDto } from "./dto/create-exchange-request.dto";
// import { FilterExchangeRequestDto } from "./dto/filter-exchange-request.dto";
// import { UpdateExchangeRequestDto } from "./dto/update-exchange-request.dto";
// import { ExchangeRequestNotFoundError } from "./errors/exchange-request-not-found.error";
import { ExchangeRequestEntity } from "./exchange-request.entity";
import { ExchangeRequestNotFoundError } from "./errors/exchange-request-not-found.error";

@Injectable()
export class ExchangeRequestService {
	constructor(
		@InjectRepository(ExchangeRequestEntity)
		private exchangeRequestRepository: Repository<ExchangeRequestEntity>,
		private readonly cliectService: ClientService,
	) {}

	async create(dto: CreateExchangeRequestDto) {
		await this.cliectService.checkExists(dto.client_id);

		const exchangeRequest = this.exchangeRequestRepository.create(dto);

		return await this.exchangeRequestRepository.save(exchangeRequest);
	}

	async readOne(id: number) {
		const findOne = await this.exchangeRequestRepository.findOne({
			relations: { client: true },
			where: { id },
		});

		if (!findOne) {
			throw new ExchangeRequestNotFoundError(
				`'${id}' exchange request not found`,
			);
		}
		return findOne;
	}

	async readAll() // dto: FilterExchangeRequestDto,
	: Promise<ExchangeRequestEntity[]> {
		const exchangeRequestQuery = await this.exchangeRequestRepository.find({
			relations: { client: true },
		});

		return exchangeRequestQuery;
	}

	// update(id: number, dto: UpdateExchangeRequestDto) {
	// 	this.readOne(id);
	// const mergedExchangeRequest = this.exchangeRequestRepository.merge(
	// 	foundExchangeRequest,
	// 	dto,
	// );
	// return await this.exchangeRequestRepository.save(mergedExchangeRequest);
	// }
}
