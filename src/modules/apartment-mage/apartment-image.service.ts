import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ApartmentImageEntity } from "./apartment-image.entity";
import { CreateApartmentImageDto } from "./dto/create-apartment-image.dto";
import { ApartmentImageFoundError } from "./errors/ApartmentImageNotFound.error";

@Injectable()
export class ApartmentImageService {
	constructor(
		@InjectRepository(ApartmentImageEntity)
		private readonly apartmentImageRepository: Repository<ApartmentImageEntity>,
	) {}

	async create(dto: CreateApartmentImageDto) {
		const image = this.apartmentImageRepository.create(dto);
		return await this.apartmentImageRepository.save(image);
	}

	async readAll() {
		return await this.apartmentImageRepository.find();
	}

	async readOne(id: number) {
		const data = await this.apartmentImageRepository.findOne({
			where: { id },
		});

		if (!data) {
			throw new ApartmentImageFoundError(`id: ${id}`);
		}

		return data;
	}

	async delete(id: number) {
		const foundBanner = await this.readOne(id);

		await this.apartmentImageRepository.delete(id);
		return foundBanner;
	}
}
