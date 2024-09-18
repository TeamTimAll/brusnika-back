import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CityService } from "../cities/cities.service";

import { BannerEntity } from "./banner.entity";
import { BannerFilterDto } from "./dto/BannerFilter.dto";
import { CreateBannerDto } from "./dto/CreateBanner.dto";
import { UpdateBannerDto } from "./dto/UpdateBanner.dto";
import { BannerNotFoundError } from "./errors/BannerNotFound.error";

@Injectable()
export class BannerService {
	constructor(
		@InjectRepository(BannerEntity)
		private readonly bannerRepository: Repository<BannerEntity>,
		private readonly cityService: CityService,
	) {}

	async create(dto: CreateBannerDto) {
		await this.cityService.checkExsits(dto.city_id);

		const banner = this.bannerRepository.create(dto);
		return await this.bannerRepository.save(banner);
	}

	async readAll(dto: BannerFilterDto) {
		const pageSize = (dto.page - 1) * dto.limit;
		return await this.bannerRepository.find({
			take: dto.limit,
			skip: pageSize,
		});
	}

	async readOne(id: number) {
		const banner = await this.bannerRepository.findOne({
			where: { id: id },
		});
		if (!banner) {
			throw new BannerNotFoundError(`id: ${id}`);
		}
		return banner;
	}

	async update(id: number, dto: UpdateBannerDto) {
		const foundBanner = await this.readOne(id);
		return await this.bannerRepository.save(
			this.bannerRepository.merge(foundBanner, dto),
		);
	}

	async delete(id: number) {
		const foundBanner = await this.readOne(id);
		await this.bannerRepository.delete(id);
		return foundBanner;
	}
}
