import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";

import { ICurrentUser } from "interfaces/current-user.interface";

import { CityService } from "../../modules/cities/cities.service";

import { AgencyEntity } from "./agencies.entity";
import { CreateAgenciesDto } from "./dtos/create-agencies.dto";
import { UpdateAgenciesDto } from "./dtos/update-agencies.dto";
import { AgencyNotFoundError } from "./errors/AgencyNotFound.error";

@Injectable()
export class AgencyService {
	constructor(
		@InjectRepository(AgencyEntity)
		private agencyRepository: Repository<AgencyEntity>,
		@Inject() private cityService: CityService,
	) {}

	get repository(): Repository<AgencyEntity> {
		return this.agencyRepository;
	}

	async readAll(name?: string): Promise<AgencyEntity[]> {
		const foundAgencies = await this.agencyRepository.find({
			where: {
				title: name ? ILike(`%${name}%`) : undefined,
			},
		});

		if (!foundAgencies.length) {
			throw new AgencyNotFoundError(`name: ${name}`);
		}

		return foundAgencies;
	}

	async readOne(id: number) {
		const foundAgency = await this.agencyRepository.findOne({
			where: {
				id: id,
			},
		});
		if (!foundAgency) {
			throw new AgencyNotFoundError(`id: ${id}`);
		}
		return foundAgency;
	}

	async create(dto: CreateAgenciesDto, user: ICurrentUser) {
		// Check city exist or not
		await this.cityService.readOne(dto.city_id);
		const agency = this.agencyRepository.create(dto);
		agency.create_by_id = user.user_id;
		return await this.agencyRepository.save(agency);
	}

	async update(id: number, dto: UpdateAgenciesDto) {
		const foundAgency = await this.readOne(id);
		// Check city exist or not
		await this.cityService.readOne(dto.city_id);
		const mergedAgency = this.agencyRepository.merge(foundAgency, dto);
		return await this.agencyRepository.save(mergedAgency);
	}

	async delete(id: number) {
		const foundAgency = await this.readOne(id);
		await this.agencyRepository.delete(foundAgency.id);
		return foundAgency;
	}
}
