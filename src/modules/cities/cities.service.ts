import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";

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
}
