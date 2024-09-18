import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ICurrentUser } from "interfaces/current-user.interface";

import { ClientService } from "../client/client.service";
import { ProjectService } from "../projects/projects.service";
import { UserService } from "../user/user.service";

import { CreateVisitsDto } from "./dtos/CreateVisits.dto";
import { UpdateVisitsDto } from "./dtos/UpdateVisits.dto";
import { VisitNotFoundError } from "./errors/VisitsNotFound.error";
import { VisitsEntity } from "./visits.entity";

@Injectable()
export class VisitsService {
	constructor(
		@InjectRepository(VisitsEntity)
		private visitsRepository: Repository<VisitsEntity>,

		@Inject() private projectService: ProjectService,
		@Inject() private clientService: ClientService,
		@Inject() private userService: UserService,
	) {}

	get repository(): Repository<VisitsEntity> {
		return this.visitsRepository;
	}

	async create(dto: CreateVisitsDto) {
		if (typeof dto.project_id !== "undefined") {
			await this.projectService.readOne(dto.project_id);
		}
		if (typeof dto.client_id !== "undefined") {
			await this.clientService.checkExists(dto.client_id);
		}
		if (typeof dto.agent_id !== "undefined") {
			await this.userService.readOne(dto.agent_id);
		}
		const visit = this.visitsRepository.create(dto);
		return await this.visitsRepository.save(visit);
	}

	async readAll(user: ICurrentUser): Promise<VisitsEntity[]> {
		return this.visitsRepository.find({
			where: { agent_id: user.user_id },
		});
	}

	async readOne(id: number): Promise<VisitsEntity> {
		const findOne = await this.visitsRepository.findOne({
			where: { id },
		});
		if (!findOne) {
			throw new VisitNotFoundError(`'${id}' city not found`);
		}
		return findOne;
	}

	async update(
		id: number,
		dto: Partial<UpdateVisitsDto>,
	): Promise<VisitsEntity> {
		const foundCity = await this.readOne(id);
		if (typeof dto.project_id !== "undefined") {
			await this.projectService.readOne(dto.project_id);
		}
		if (typeof dto.client_id !== "undefined") {
			await this.clientService.checkExists(dto.client_id);
		}
		if (typeof dto.agent_id !== "undefined") {
			await this.userService.readOne(dto.agent_id);
		}
		const mergedCity = this.visitsRepository.merge(foundCity, dto);
		return await this.visitsRepository.save(mergedCity);
	}

	async delete(id: number): Promise<VisitsEntity> {
		const foundCity = await this.readOne(id);
		await this.visitsRepository.delete(id);
		return foundCity;
	}
}
