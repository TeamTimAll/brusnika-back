import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";

import { BaseDto } from "../../common/base/base_dto";
import { LeadsEntity, LeadState } from "../leads/leads.entity";
import { NewsEntity } from "../news/news.entity";
import { LeadOpStatus } from "../leads/lead_ops.entity";
import { NewsLikeEntity } from "../news/entities/likes.entity";
import { NewsViewEntity } from "../news/entities/views.entity";
import { TrainingEntity } from "../trainings/trainings.entity";
import { EventsEntity } from "../events/events.entity";
import { UserService } from "../user/user.service";
import { EventInvitationEntity } from "../events/entities/event-invition.entity";
import { ClientEntity } from "../client/client.entity";

import { AnalyticsEntity } from "./analytics.entity";
import { AnalyticsNotFoundError } from "./errors/AnalyticsNotFound.error";
import {
	BaseAnalyticsDto,
	LeadAnalyticsDto,
	MainAnalyticsDto,
	UsersAnalyticsDto,
} from "./dtos";
import { ICompletedLeadsRatingResponse } from "./types";

@Injectable()
export class AnalyticsService {
	constructor(
		@InjectRepository(AnalyticsEntity)
		private readonly analyticsRepository: Repository<AnalyticsEntity>,
		@InjectRepository(LeadsEntity)
		private readonly leadRepository: Repository<LeadsEntity>,
		@InjectRepository(NewsEntity)
		private readonly newsRepository: Repository<NewsEntity>,
		@InjectRepository(NewsEntity)
		private readonly newsLikeRepository: Repository<NewsLikeEntity>,
		@InjectRepository(NewsEntity)
		private readonly newsViewRepository: Repository<NewsViewEntity>,
		@InjectRepository(TrainingEntity)
		private readonly trainingRepository: Repository<TrainingEntity>,
		@InjectRepository(EventsEntity)
		private readonly eventRepository: Repository<EventsEntity>,
		@InjectRepository(EventInvitationEntity)
		private readonly eventInvitationRepository: Repository<EventInvitationEntity>,
		@InjectRepository(ClientEntity)
		private readonly clientRepository: Repository<ClientEntity>,
		private readonly usersService: UserService,
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

	async managerStatisticsByCount({
		fromDate,
		limit,
		page,
		toDate,
	}: BaseAnalyticsDto) {
		const offset = (page - 1) * limit;

		let query = this.leadRepository
			.createQueryBuilder("leads")
			.innerJoin("leads.manager", "manager")
			.innerJoin("manager.agency", "agency")
			.select([
				"manager.first_name AS first_name",
				"manager.last_name AS last_name",
				"agency.title AS agency_name",
				"COUNT(leads.id) AS total",
			])
			.where("leads.state = :state", { state: LeadState.COMPLETE })
			.andWhere("leads.created_at BETWEEN :fromDate AND :toDate", {
				fromDate,
				toDate,
			})
			.groupBy("manager.id, agency.title")
			.orderBy("total", "DESC");

		const count = await query.getCount();

		query = query.limit(limit).offset(offset);

		const metaData = BaseDto.create<ICompletedLeadsRatingResponse[]>();
		metaData.setPagination(count, page, limit);
		metaData.data =
			(await query.getRawMany()) as unknown as ICompletedLeadsRatingResponse[];

		return metaData;
	}

	async managerStatisticsByPrice({
		fromDate,
		limit,
		page,
		toDate,
	}: BaseAnalyticsDto) {
		const offset = (page - 1) * limit;

		let query = this.leadRepository
			.createQueryBuilder("leads")
			.leftJoin("leads.manager", "manager")
			.leftJoin("manager.agency", "agency")
			.leftJoin("leads.premise", "premise")
			.where("leads.state = :state", { state: LeadState.COMPLETE })
			.andWhere("leads.created_at BETWEEN :fromDate AND :toDate", {
				fromDate,
				toDate,
			})
			.select([
				"agency.title as agency_name",
				"manager.first_name AS first_name",
				"manager.last_name AS last_name",
				"SUM(premise.price) AS total",
			])
			.groupBy(
				"manager.id, agency.title, manager.firstName, manager.lastName",
			)
			.orderBy("total", "DESC");

		const count = await query.getCount();

		query = query.limit(limit).offset(offset);

		const metaData = BaseDto.create<ICompletedLeadsRatingResponse[]>();
		metaData.setPagination(count, page, limit);
		metaData.data =
			(await query.getRawMany()) as unknown as ICompletedLeadsRatingResponse[];

		return metaData;
	}

	async managerStatisticsByTime({
		fromDate,
		toDate,
		limit,
		page,
	}: BaseAnalyticsDto) {
		const offset = (page - 1) * limit;

		let query = this.leadRepository
			.createQueryBuilder("leads")
			.innerJoin("leads.manager", "manager")
			.innerJoin("manager.agency", "agency")
			.innerJoin("leads.lead_ops", "lo_won", "lo_won.status = :status", {
				status: LeadOpStatus.WON,
			})
			.select([
				"agency.title AS agency_name",
				"manager.first_name AS first_name",
				"manager.last_name AS last_name",
				"MIN(DATE_PART('day', lo_won.updated_at - leads.created_at)) AS total",
			])
			.andWhere("leads.created_at BETWEEN :fromDate AND :toDate", {
				fromDate,
				toDate,
			})
			.groupBy("agency.title, manager.first_name, manager.last_name")
			.orderBy("total", "ASC");

		const count = await query.getCount();

		query = query.limit(limit).offset(offset);

		const metaData = BaseDto.create<ICompletedLeadsRatingResponse[]>();
		metaData.setPagination(count, page, limit);
		metaData.data =
			(await query.getRawMany()) as unknown as ICompletedLeadsRatingResponse[];

		return metaData;
	}

	async getLeadsCount(
		fromDate: Date,
		toDate: Date,
		status?: LeadOpStatus,
	): Promise<number> {
		const query = this.leadRepository
			.createQueryBuilder("leads")
			.where("leads.created_at BETWEEN :fromDate AND :toDate", {
				fromDate,
				toDate,
			})
			.select("COUNT(leads.id)", "total_leads");

		if (status) {
			query.andWhere("leads.current_status = :status", { status });
		}

		const result: { total_leads: string } | undefined =
			await query.getRawOne();

		return result ? Number(result.total_leads) : 0;
	}

	async getLeadsByCurrentStatus(
		fromDate: Date,
		toDate: Date,
	): Promise<{ status: LeadOpStatus; total: number }[]> {
		const query = this.leadRepository
			.createQueryBuilder("leads")
			.select("leads.current_status", "status")
			.addSelect("COUNT(leads.id)::INT", "total")
			.where("leads.created_at BETWEEN :fromDate AND :toDate", {
				fromDate,
				toDate,
			})
			.groupBy("leads.current_status");

		const result: { status: LeadOpStatus; total: number }[] =
			await query.getRawMany();

		return result;
	}

	async getClientsCount(fromDate: Date, toDate: Date): Promise<number> {
		const result = await this.clientRepository.count({
			where: {
				created_at: Between(fromDate, toDate),
			},
		});

		return result;
	}

	async getTopNewsByViews({
		fromDate,
		limit,
		page,
		toDate,
	}: BaseAnalyticsDto) {
		const offset = (page - 1) * limit;

		let query = this.newsRepository
			.createQueryBuilder("news")
			.leftJoinAndSelect("news.views", "views")
			.select([
				"news.id",
				"news.title",
				"news.content",
				"news.cover_image",
				"news.published_at",
				"COUNT(DISTINCT views.id)::INT AS total",
			])
			.where("news.published_at BETWEEN :fromDate AND :toDate", {
				fromDate,
				toDate,
			})
			.groupBy("news.id")
			.orderBy("total", "DESC");

		const count = await query.getCount();

		query = query.limit(limit).offset(offset);

		const metaData = BaseDto.create<NewsEntity[]>();
		metaData.setPagination(count, page, limit);
		metaData.data = await query.getRawMany();

		return metaData;
	}

	async getTotalNewsViews(fromDate: Date, toDate: Date): Promise<number> {
		const result: { total: string } | undefined =
			await this.newsViewRepository
				.createQueryBuilder("news_views")
				.where("news_views.created_at BETWEEN :fromDate AND :toDate", {
					fromDate,
					toDate,
				})
				.select("COUNT(news_views.id)", "total")
				.getRawOne();

		return result ? Number(result.total) : 0;
	}

	async getTotalNewsLikes(fromDate: Date, toDate: Date): Promise<number> {
		const result: { total: string } | undefined =
			await this.newsLikeRepository
				.createQueryBuilder("news_likes")
				.where("news_likes.created_at BETWEEN :fromDate AND :toDate", {
					fromDate,
					toDate,
				})
				.select("COUNT(news_likes.id)", "total")
				.getRawOne();

		return result ? Number(result.total) : 0;
	}

	async getTopTrainings({
		fromDate,
		limit,
		page,
		toDate,
	}: BaseAnalyticsDto): Promise<BaseDto<TrainingEntity[]>> {
		const offset = (page - 1) * limit;

		let query = this.trainingRepository
			.createQueryBuilder("trainings")
			.leftJoin("trainings.views", "views")
			.leftJoinAndSelect("trainings.category", "category")
			.select([
				"trainings.id",
				"trainings.title",
				"category.name as category_name",
				"COUNT(DISTINCT views.id)::INT AS total",
			])
			.where("trainings.published_at BETWEEN :fromDate AND :toDate", {
				fromDate,
				toDate,
			})
			.groupBy("trainings.id, category.name")
			.orderBy("total", "DESC");

		const count = await query.getCount();

		query = query.limit(limit).offset(offset);

		const metaData = BaseDto.create<TrainingEntity[]>();
		metaData.setPagination(count, page, limit);
		metaData.data = await query.getRawMany();

		return metaData;
	}

	async getTopEventsByViews({
		fromDate,
		limit,
		page,
		toDate,
	}: BaseAnalyticsDto): Promise<BaseDto<EventsEntity[]>> {
		const offset = (page - 1) * limit;

		let query = this.eventRepository
			.createQueryBuilder("events")
			.leftJoinAndSelect("events.views", "views")
			.select([
				"events.id",
				"events.title",
				"events.photo",
				"events.tags",
				"COUNT(DISTINCT views.id)::INT AS total",
			])
			.where("events.date BETWEEN :fromDate AND :toDate", {
				fromDate,
				toDate,
			})
			.groupBy("events.id")
			.orderBy("total", "DESC");

		const count = await query.getCount();

		query = query.limit(limit).offset(offset);

		const metaData = BaseDto.create<EventsEntity[]>();
		metaData.setPagination(count, page, limit);
		metaData.data = await query.getRawMany();

		return metaData;
	}

	async getUsersByCity(payload: UsersAnalyticsDto) {
		const data = await this.usersService.getUserCountByCity(
			payload.fromDate,
			payload.toDate,
			payload.role,
		);

		return data;
	}

	async getUsersByDate(payload: UsersAnalyticsDto) {
		const data = await this.usersService.getUserCountByDate(
			payload.fromDate,
			payload.toDate,
			payload.role,
		);

		return data;
	}

	async getCompletedLeadsFee(fromDate: Date, toDate: Date, is_avg?: boolean) {
		const query = this.leadRepository
			.createQueryBuilder("leads")
			.where("leads.state = :state", { state: LeadState.COMPLETE })
			.andWhere("leads.created_at BETWEEN :fromDate AND :toDate", {
				fromDate,
				toDate,
			})
			.andWhere("leads.fee IS NOT NULL");

		if (is_avg) {
			query.select("AVG(leads.fee)", "total");
		} else {
			query.select("SUM(leads.fee)", "total");
		}

		const result: { total: number } | undefined = await query.getRawOne();

		return result ? Number(result.total) : 0;
	}

	async getEventInvitations(fromDate: Date, toDate: Date): Promise<number> {
		const result = await this.eventInvitationRepository.count({
			where: {
				created_at: Between(fromDate, toDate),
			},
		});

		return result;
	}

	async getAveragePriceOfCompletedLeads(
		fromDate: Date,
		toDate: Date,
	): Promise<number> {
		const result: { total: string } | undefined = await this.leadRepository
			.createQueryBuilder("leads")
			.innerJoinAndSelect("leads.premise", "premise")
			.where("leads.state = :state", { state: LeadState.COMPLETE })
			.andWhere("leads.created_at BETWEEN :fromDate AND :toDate", {
				fromDate,
				toDate,
			})
			.select("AVG(premise.price)", "total")
			.getRawOne();

		return result ? Number(result.total) : 0;
	}

	async getAverageSizeOfCompletedLeads(
		fromDate: Date,
		toDate: Date,
	): Promise<number> {
		const result: { total: string } | undefined = await this.leadRepository
			.createQueryBuilder("leads")
			.innerJoinAndSelect("leads.premise", "premise")
			.where("leads.state = :state", { state: LeadState.COMPLETE })
			.andWhere("leads.created_at BETWEEN :fromDate AND :toDate", {
				fromDate,
				toDate,
			})
			.select("AVG(premise.size)", "total")
			.getRawOne();

		return result ? Number(result.total) : 0;
	}

	async getMainAnalytics({ fromDate, toDate }: MainAnalyticsDto) {
		const pastFromDate = this.getOneMonthBefore(fromDate);
		const pastToDate = this.getOneMonthBefore(toDate);

		const currentPastPairs = await Promise.all([
			this.getDataPair(
				() => this.getTotalNewsLikes(fromDate, toDate),
				() => this.getTotalNewsLikes(pastFromDate, pastToDate),
			),
			this.getDataPair(
				() => this.getTotalNewsViews(fromDate, toDate),
				() => this.getTotalNewsViews(pastFromDate, pastToDate),
			),
			this.getDataPair(
				() => this.getLeadsCount(fromDate, toDate, LeadOpStatus.WON),
				() =>
					this.getLeadsCount(
						pastFromDate,
						pastToDate,
						LeadOpStatus.WON,
					),
			),
			this.getDataPair(
				() => this.getEventInvitations(fromDate, toDate),
				() => this.getEventInvitations(pastFromDate, pastToDate),
			),
			this.getDataPair(
				() => this.getClientsCount(fromDate, toDate),
				() => this.getClientsCount(pastFromDate, pastToDate),
			),
			this.getDataPair(
				() => this.getCompletedLeadsFee(fromDate, toDate),
				() => this.getCompletedLeadsFee(pastFromDate, pastToDate),
			),
			this.getDataPair(
				() => this.getCompletedLeadsFee(fromDate, toDate, true),
				() => this.getCompletedLeadsFee(pastFromDate, pastToDate, true),
			),
			this.getDataPair(
				() => this.getAveragePriceOfCompletedLeads(fromDate, toDate),
				() =>
					this.getAveragePriceOfCompletedLeads(
						pastFromDate,
						pastToDate,
					),
			),
			this.getDataPair(
				() => this.getAverageSizeOfCompletedLeads(fromDate, toDate),
				() =>
					this.getAverageSizeOfCompletedLeads(
						pastFromDate,
						pastToDate,
					),
			),
		]);

		const [
			newsLikes,
			newsViews,
			completedLeads,
			eventInvitations,
			clients,
			completedLeadsFee,
			completedLeadsFeeAvg,
			averagePriceOfCompletedLeads,
			averageSizeOfCompletedLeads,
		] = currentPastPairs.map(([current, past]) =>
			this.calculateDifference(current, past),
		);

		return {
			news_likes: newsLikes,
			news_views: newsViews,
			completed_leads: completedLeads,
			event_invitations: eventInvitations,
			clients,
			complited_leads_fee: completedLeadsFee,
			complited_leads_fee_avg: completedLeadsFeeAvg,
			complited_leads_avg_price: averagePriceOfCompletedLeads,
			complited_leads_avg_size: averageSizeOfCompletedLeads,
		};
	}

	async getLeadsCountByStatus({
		fromDate,
		toDate,
		status,
	}: LeadAnalyticsDto) {
		const pastFromDate = this.getOneMonthBefore(fromDate);
		const pastToDate = this.getOneMonthBefore(toDate);

		const currentPastPairs = await Promise.all([
			this.getDataPair(
				() => this.getLeadsCount(fromDate, toDate, status),
				() => this.getLeadsCount(pastFromDate, pastToDate, status),
			),
		]);

		const [leads] = currentPastPairs.map(([current, past]) =>
			this.calculateDifference(current, past),
		);

		return leads;
	}

	async getDataPair(
		currentFn: () => Promise<number>,
		pastFn: () => Promise<number>,
	): Promise<[number, number]> {
		const [current, past] = await Promise.all([currentFn(), pastFn()]);
		return [current, past];
	}

	getOneMonthBefore(date: Date): Date {
		const result = new Date(date);
		result.setMonth(result.getMonth() - 1);
		return result;
	}

	calculateDifference(current: number, past: number) {
		const difference = current - past;
		const percent = past ? ((current - past) / past) * 100 : 0;
		return { past, current, difference, percent };
	}
}
