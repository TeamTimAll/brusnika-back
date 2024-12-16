import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsSelect, ILike, Repository } from "typeorm";

import { ICurrentUser } from "interfaces/current-user.interface";
import { PickBySelect } from "interfaces/pick_by_select";

import { CityService } from "../../modules/cities/cities.service";
import { AgencyQueueService } from "../queues/agency/agency.service";

import { AgencyEntity } from "./agencies.entity";
import { CounterAgent } from "./dtos/AgencySync.dto";
import { CreateAgenciesDto } from "./dtos/CreateAgencies.dto";
import { UpdateAgenciesDto } from "./dtos/UpdateAgencies.dto";
import { AgencyNotFoundError } from "./errors/AgencyNotFound.error";
import { CreateAgenciesV2Dto } from "./dtos/CreateAgenciesV2.dto";

@Injectable()
export class AgencyService {
	constructor(
		@InjectRepository(AgencyEntity)
		private agencyRepository: Repository<AgencyEntity>,
		@Inject() private cityService: CityService,
		@Inject(forwardRef(() => AgencyQueueService))
		private agencyQueueService: AgencyQueueService,
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

	async checkExsits(id: number): Promise<void> {
		const agency = await this.agencyRepository.existsBy({ id });
		if (!agency) {
			throw new AgencyNotFoundError(`'${id}' agency not found`);
		}
	}

	async create(dto: CreateAgenciesDto, user: ICurrentUser) {
		// Check city exist or not
		await this.cityService.readOne(dto.city_id);
		const agency = this.agencyRepository.create(dto);
		agency.create_by_id = user.user_id;

		await this.agencyQueueService.makeRequest(
			await this.agencyQueueService.createFormEntity(agency),
		);

		return await this.agencyRepository.save(agency);
	}

	async createV2(dto: CreateAgenciesV2Dto, user: ICurrentUser) {
		// Check city exist or not
		await this.cityService.readOne(dto.city_id);
		const agency = this.agencyRepository.create(dto);
		agency.create_by_id = user.user_id;

		await this.agencyQueueService.makeRequest(
			await this.agencyQueueService.createFormEntityV2(agency),
		);

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

	async sync() {
		// const counterAgenciesResponse = await fetch(
		// 	"https://counter-server.com/agency",
		// );
		// const counterAgencies = (await counterAgenciesResponse.json()) as
		// 	| CounterAgent[]
		// 	| undefined;
		const counterAgencies: CounterAgent[] = [
			{
				id: "9f938798-3438-491b-9e02-25751a7eff14",
				type: "type",
				isClient: false,
				localIds: [],
				name: "Agency 1",
				inn: "He found the end of the rainbow and was surprised at what he found there.",
				passport: "",
				registeredAddress: "",
				actualAddress: "",
				organizationName: "privilege",
				organizationFullName: "privilege acid",
				kpp: "",
				ogrn: "",
			},
		];
		if (!counterAgencies) {
			throw new AgencyNotFoundError();
		}
		const agencies: AgencyEntity[] = [];
		counterAgencies.forEach((ca) => {
			agencies.push(
				this.agencyRepository.create({
					ext_id: ca.id,
					legalName: ca.name,
					inn: ca.inn,
					ownerFullName: ca.organizationFullName,
				}),
			);
		});
		return (
			await this.agencyRepository
				.createQueryBuilder()
				.insert()
				.values(agencies)
				.orIgnore()
				.returning("*")
				.execute()
		).generatedMaps;
	}

	async readOneByExtId<T extends FindOptionsSelect<AgencyEntity>>(
		ext_id: string,
		select?: T,
	): Promise<PickBySelect<AgencyEntity, T>> {
		const client = await this.agencyRepository.findOne({
			select: select,
			where: { ext_id: ext_id },
		});
		if (!client) {
			throw new AgencyNotFoundError(`ext_id: ${ext_id}`);
		}
		return client;
	}
}
