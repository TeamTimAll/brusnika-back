import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { BuildingsService } from "../buildings/buildings.service";
import { ClientService } from "../client/client.service";
import { PremiseNotFoundError } from "../premises/errors/PremiseNotFound.error";
import { PremisesService } from "../premises/premises.service";

import { CreateMortgageRequestDto } from "./dtos";
import { MortgageRequestEntity } from "./mortgage-request.entity";

@Injectable()
export class MortgageRequestService {
	constructor(
		// Repositories
		@InjectRepository(MortgageRequestEntity)
		public readonly mortgageRequestRepository: Repository<MortgageRequestEntity>,

		// Services
		private readonly clientService: ClientService,
		private readonly premisesService: PremisesService,
		private readonly buildingsService: BuildingsService,
	) {}

	async create(
		payload: CreateMortgageRequestDto,
	): Promise<MortgageRequestEntity> {
		const {
			building_id,
			client_id,
			comment,
			cost,
			first_payment,
			premise_id,
		} = payload;

		const foundPremises = await this.premisesService.readOne(premise_id);
		if (!foundPremises.id) {
			throw new PremiseNotFoundError(`premise_id: ${premise_id}`);
		}

		await this.buildingsService.readOne(foundPremises.building_id!);

		await this.clientService.checkExists(client_id);

		const result = await this.mortgageRequestRepository.save({
			building_id,
			client_id,
			premise_id,
			first_payment,
			cost,
			comment,
		});

		return result;
	}
}
