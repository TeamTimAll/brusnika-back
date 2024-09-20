import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, EntityManager, In, Repository } from "typeorm";

import { CityService } from "../cities/cities.service";

import { BannerEntity } from "./banner.entity";
import { BannerFilterDto } from "./dto/BannerFilter.dto";
import { BulkBannerDto, BulkUpdateBannerDto } from "./dto/BulkBanner.dto";
import { CreateBannerDto } from "./dto/CreateBanner.dto";
import { UpdateBannerDto } from "./dto/UpdateBanner.dto";
import { BannerNotFoundError } from "./errors/BannerNotFound.error";

@Injectable()
export class BannerService {
	constructor(
		@InjectRepository(BannerEntity)
		private readonly bannerRepository: Repository<BannerEntity>,
		private readonly cityService: CityService,
		private readonly dataSource: DataSource,
	) {}

	async create(dto: CreateBannerDto) {
		await this.cityService.checkExsits(dto.city_id);

		const banner = this.bannerRepository.create(dto);
		return await this.bannerRepository.save(banner);
	}

	async bulk(dto: BulkBannerDto) {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const createdBanners = await this.bulkCreate(
				queryRunner.manager,
				dto.create,
			);
			const updatedBanners = await this.bulkUpdate(
				queryRunner.manager,
				dto.update,
			);
			const deletedBanners = await this.bulkDelete(
				queryRunner.manager,
				dto.delete,
			);
			await queryRunner.commitTransaction();
			return {
				create: createdBanners,
				update: updatedBanners,
				delete: deletedBanners,
			};
		} catch (e) {
			await queryRunner.rollbackTransaction();
			throw e;
		} finally {
			await queryRunner.release();
		}
	}

	private async bulkCreate(
		manager: EntityManager,
		banners: CreateBannerDto[],
	): Promise<BannerEntity[]> {
		if (!banners.length) {
			return [];
		}
		const cityIds: Set<number> = new Set(banners.map((b) => b.city_id));
		await this.cityService.checkExsitsIds([...cityIds]);

		return await manager.save(
			BannerEntity,
			this.bannerRepository.create(banners),
			{ chunk: 20 },
		);
	}

	private async bulkUpdate(
		manager: EntityManager,
		banners: BulkUpdateBannerDto[],
	) {
		if (!banners.length) {
			return [];
		}
		const bannerIds: Set<number> = new Set(banners.map((b) => b.id));
		const foundBanners = await this.checkExsitsIds([...bannerIds]);

		const cityIds: Set<number> = new Set(
			banners
				.filter(
					(b) =>
						typeof b.city_id !== "undefined" || b.city_id !== null,
				)
				.map((b) => b.city_id!),
		);
		await this.cityService.checkExsitsIds([...cityIds]);

		const mergedBanners: BannerEntity[] = [];
		foundBanners.forEach((e, i) => {
			mergedBanners.push(this.bannerRepository.merge(e, banners[i]));
		});
		return await manager.save(BannerEntity, mergedBanners, { chunk: 20 });
	}

	async bulkDelete(
		manager: EntityManager,
		bannerIds: number[],
	): Promise<number[]> {
		if (!bannerIds.length) {
			return [];
		}
		const uniqueBannerIds: number[] = [...new Set(bannerIds)];
		await this.checkExsitsIds(uniqueBannerIds);
		await manager.delete(BannerEntity, uniqueBannerIds);
		return uniqueBannerIds;
	}

	async checkExsitsIds(ids: number[]): Promise<BannerEntity[]> {
		const banners = await this.bannerRepository.find({
			where: { id: In(ids) },
		});
		if (ids.length !== banners.length) {
			throw new BannerNotFoundError(`ids: '${ids.join(", ")}'`);
		}
		return banners;
	}

	async readAll(dto: BannerFilterDto) {
		const pageSize = (dto.page - 1) * dto.limit;
		return await this.bannerRepository.find({
			where: { city_id: dto.city_id },
			take: dto.limit,
			skip: pageSize,
		});
	}

	async readAllWithCities(dto: BannerFilterDto) {
		const pageSize = (dto.page - 1) * dto.limit;
		return await this.cityService.repository.find({
			relations: {
				banner: true,
			},
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
