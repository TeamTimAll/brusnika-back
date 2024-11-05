import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ClientService } from "../client/client.service";
import { UserService } from "../user/user.service";
import { RoleType } from "../../constants";
import { UserNotFoundError } from "../user/errors/UserNotFound.error";

import { CreateCallRequestDto } from "./dto/create-call-request.dto";
import { CallRequestEntity } from "./call-request.entity";
import { CallRequestNotFoundError } from "./errors/call-request-not-found.error";
import { FilterCallRequestDto } from "./dto/filter-call-request.dto";

@Injectable()
export class CallRequestService {
	constructor(
		@InjectRepository(CallRequestEntity)
		private callRequestRepository: Repository<CallRequestEntity>,
		private readonly cliectService: ClientService,
		private readonly usersService: UserService,
	) {}

	async create(dto: CreateCallRequestDto) {
		await this.cliectService.checkExists(dto.client_id);

		const foundAgent = await this.usersService.checkExists(dto.agent_id);

		if (foundAgent.role !== RoleType.AGENT) {
			throw new UserNotFoundError(`agent(user) id: ${dto.agent_id}`);
		}

		const callRequest = this.callRequestRepository.create(dto);

		return await this.callRequestRepository.save(callRequest);
	}

	async readOne(id: number) {
		const findOne = await this.callRequestRepository.findOne({
			relations: { client: true, agent: true },
			where: { id },
		});

		if (!findOne) {
			throw new CallRequestNotFoundError(
				`'${id}' call request not found`,
			);
		}
		return findOne;
	}

	async readAll(dto: FilterCallRequestDto): Promise<CallRequestEntity[]> {
		const { client_id, agent_id, premise_id } = dto;
		const callRequestQuery = await this.callRequestRepository.find({
			relations: { client: true, agent: true },
			where: {
				client_id,
				agent_id,
				premise_id,
			},
			order: { created_at: "ASC" },
		});

		return callRequestQuery;
	}

	// async changeStatus(id: number, state: CallRequestState) {
	// 	const data = await this.readOne(id);

	// 	await this.callRequestRepository.update(
	// 		{
	// 			id,
	// 		},
	// 		{ state },
	// 	);

	// 	data.state = state;

	// 	return data;
	// }
}
