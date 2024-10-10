import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
	EntityManager,
	FindOptionsSelect,
	ILike,
	In,
	Repository,
} from "typeorm";

import { PickBySelect } from "interfaces/pick_by_select";

import { CityEntity } from "./cities.entity";
import { CreateCitiesDto } from "./dtos/CreateCities.dto";
import { UpdateCitiesDto } from "./dtos/UpdateCities.dto";
import { CityNotFoundError } from "./errors/CityNotFound.error";

@Injectable()
export class CityService {
	constructor(
		@InjectRepository(CityEntity)
		private cityRepository: Repository<CityEntity>,
	) {}

	get repository(): Repository<CityEntity> {
		return this.cityRepository;
	}

	async create(dto: CreateCitiesDto) {
		const city = this.cityRepository.create(dto);
		return await this.cityRepository.save(city);
	}

	async readAll(name?: string): Promise<CityEntity[]> {
		const cities = await this.cityRepository.find({
			where: {
				name: name ? ILike(`%${name}%`) : undefined,
			},
		});
		if (!cities.length) {
			throw new CityNotFoundError(`'${name}' city not found`);
		}
		return cities;
	}

	async readOne(id: number): Promise<CityEntity> {
		const findOne = await this.cityRepository.findOne({
			where: { id },
		});

		if (!findOne) {
			throw new CityNotFoundError(`'${id}' city not found`);
		}

		return findOne;
	}

	async checkExsits(id: number): Promise<void> {
		const city = await this.cityRepository.existsBy({ id });
		if (!city) {
			throw new CityNotFoundError(`'${id}' city not found`);
		}
	}

	async checkExsitsIds(ids: number[]): Promise<void> {
		const cities = await this.cityRepository.find({
			select: { id: true },
			where: { id: In(ids) },
		});
		if (ids.length !== cities.length) {
			throw new CityNotFoundError(`ids: '${ids.join(", ")}'`);
		}
	}

	async checkExsitsIdsManager(
		manager: EntityManager,
		ids: number[],
	): Promise<void> {
		const city = await manager.existsBy(CityEntity, { id: In(ids) });
		if (!city) {
			throw new CityNotFoundError(`'${ids.join(", ")}' city not found`);
		}
	}

	async update(id: number, dto: UpdateCitiesDto): Promise<CityEntity> {
		const foundCity = await this.readOne(id);
		const mergedCity = this.cityRepository.merge(foundCity, dto);
		return await this.cityRepository.save(mergedCity);
	}

	async delete(id: number): Promise<CityEntity> {
		const foundCity = await this.readOne(id);
		await this.cityRepository.delete(id);
		return foundCity;
	}

	async readOneByExtId<T extends FindOptionsSelect<CityEntity>>(
		ext_id: string,
		select?: T,
	): Promise<PickBySelect<CityEntity, T>> {
		const client = await this.cityRepository.findOne({
			select: select,
			where: { ext_id: ext_id },
		});
		if (!client) {
			throw new CityNotFoundError(`ext_id: ${ext_id}`);
		}
		return client;
	}
}
