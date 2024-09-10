import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AnalyticsEntity } from "./analytics.entity";
import { AnalyticsNotFoundError } from "./errors/AnalyticsNotFound.error";

@Injectable()
export class AnalyticsService {
	constructor(
		@InjectRepository(AnalyticsEntity)
		private readonly analyticsRepository: Repository<AnalyticsEntity>,
	) {}

	async createOrFind(user_id: number): Promise<AnalyticsEntity> {
		const foundAnalytics = await this.analyticsRepository.findOneBy({
			user_id,
		});
		if (foundAnalytics) {
			return foundAnalytics;
		}
		const analytics = this.analyticsRepository.create({ user_id });
		return await this.analyticsRepository.save(analytics);
	}

	async update(
		id: number,
		entityLike: Partial<AnalyticsEntity>,
	): Promise<AnalyticsEntity>;
	async update(
		mergeIntoEntity: AnalyticsEntity,
		entityLike: Partial<AnalyticsEntity>,
	): Promise<AnalyticsEntity>;
	async update(
		arg1: AnalyticsEntity | number,
		entityLike: Partial<AnalyticsEntity>,
	): Promise<AnalyticsEntity> {
		if (typeof arg1 === "number") {
			const foundAnalytics = await this.readOne(arg1);
			await this.analyticsRepository.update(
				foundAnalytics.id,
				entityLike,
			);
			return foundAnalytics;
		}
		return await this.analyticsRepository.save(
			this.analyticsRepository.merge(arg1, entityLike),
		);
	}

	async incrementCreatedCount(id: number): Promise<AnalyticsEntity> {
		const analytics = await this.readOne(id);
		await this.update(analytics, {
			all_created_entity_count: ++analytics.all_created_entity_count,
		});
		return analytics;
	}
	async incrementClientCount(id: number): Promise<AnalyticsEntity> {
		const analytics = await this.readOne(id);
		await this.update(analytics, {
			all_created_clients_count: ++analytics.all_created_clients_count,
		});
		return analytics;
	}
	async incrementSuccessLeadsCount(id: number): Promise<AnalyticsEntity> {
		const analytics = await this.readOne(id);
		await this.update(analytics, {
			all_success_leads_count: ++analytics.all_success_leads_count,
		});
		return analytics;
	}
	// avg = ((count - 1) * avg + sum) / count
	async calcAvgSuccessLeadsSum(
		id: number,
		count: number,
		sum: bigint,
	): Promise<AnalyticsEntity> {
		const analytics = await this.readOne(id);
		const avg: bigint = BigInt(analytics.avg_success_leads_sum);
		await this.update(analytics, {
			avg_success_leads_sum:
				(BigInt(count - 1) * avg + sum) / BigInt(count),
		});
		return analytics;
	}
	async calcAvgSuccessLeadsM2(
		id: number,
		count: number,
		size: number,
	): Promise<AnalyticsEntity> {
		const analytics = await this.readOne(id);
		const avg = analytics.avg_success_leads_m2;
		await this.update(analytics, {
			avg_success_leads_m2: ((count - 1) * avg + size) / count,
		});
		return analytics;
	}

	async readOne(id: number): Promise<AnalyticsEntity> {
		const foundAnalytics = await this.analyticsRepository.findOne({
			where: {
				id,
			},
		});
		if (!foundAnalytics) {
			throw new AnalyticsNotFoundError(`id: ${id}`);
		}
		return foundAnalytics;
	}
}
