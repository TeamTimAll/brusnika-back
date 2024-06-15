import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { BuildingsService } from "../buildings/buildings.service";
import { BuildingNotFoundError } from "../buildings/errors/BuildingNotFound.error";
import { ClientService } from "../client/client.service";
import { PremiseNotFoundError } from "../premises/errors/PremiseNotFound.error";
import { PremisesService } from "../premises/premises.service";
import { ProjectsService } from "../projects/projects.service";

import { CreateLeadDto } from "./dtos/leads.create.dto";
import { LeadsEntity } from "./leads.entity";

@Injectable()
export class LeadsService {
	constructor(
		@InjectRepository(LeadsEntity)
		private readonly repository: Repository<LeadsEntity>,
		private readonly clientService: ClientService,
		private readonly prjectService: ProjectsService,
		private readonly premisesService: PremisesService,
		private readonly buildingsService: BuildingsService,
	) {}

	async create(lead: CreateLeadDto) {
		const foundPremises = await this.premisesService.repository.findOne({
			where: {
				id: lead.premise_id,
			},
		});
		if (!foundPremises) {
			throw new PremiseNotFoundError();
		}
		const foundBuilding = await this.buildingsService.repository.findOne({
			where: {
				id: foundPremises.building_id,
			},
		});
		if (!foundBuilding) {
			throw new BuildingNotFoundError();
		}
		const foundProject = await this.prjectService.repository.findOne({
			where: {
				id: foundBuilding.project_id,
			},
		});

		await this.repository.save({
			...lead,
		});
	}
}
