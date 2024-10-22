import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Brackets, Repository } from "typeorm";

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
import { PremiseBasketLinkEntity } from "../premises/entities";
import { ICurrentUser } from "../../interfaces/current-user.interface";
import { RoleType } from "../../constants";

import {
	LeadAnalyticsDto,
	MainAnalyticsDto,
	TopAnalyticsDto,
	UsersAnalyticsDto,
} from "./dtos";
import { ICompletedLeadsRatingResponse } from "./types";

@Injectable()
export class AnalyticsService {
	constructor(
		@InjectRepository(LeadsEntity)
		private readonly leadRepository: Repository<LeadsEntity>,
		@InjectRepository(NewsEntity)
		private readonly newsRepository: Repository<NewsEntity>,
		@InjectRepository(NewsLikeEntity)
		private readonly newsLikeRepository: Repository<NewsLikeEntity>,
		@InjectRepository(NewsViewEntity)
		private readonly newsViewRepository: Repository<NewsViewEntity>,
		@InjectRepository(TrainingEntity)
		private readonly trainingRepository: Repository<TrainingEntity>,
		@InjectRepository(EventsEntity)
		private readonly eventRepository: Repository<EventsEntity>,
		@InjectRepository(EventInvitationEntity)
		private readonly eventInvitationRepository: Repository<EventInvitationEntity>,
		@InjectRepository(ClientEntity)
		private readonly clientRepository: Repository<ClientEntity>,
		@InjectRepository(PremiseBasketLinkEntity)
		private readonly premiseBasketLinkRepository: Repository<PremiseBasketLinkEntity>,
		private readonly usersService: UserService,
	) {}

	async managerStatisticsByCount(
		{ fromDate, limit, page, toDate }: TopAnalyticsDto,
		user: ICurrentUser,
	) {
		const offset = (page - 1) * limit;

		const userInfo = await this.usersService.me(user.user_id);

		let query = this.leadRepository
			.createQueryBuilder("leads")
			.leftJoin("leads.manager", "manager")
			.leftJoin("manager.agency", "agency")
			.select([
				"manager.first_name AS first_name",
				"manager.last_name AS last_name",
				"manager.avatar AS photo",
				"agency.title AS agency_name",
				"COUNT(leads.id)::INT AS total",
			])
			.where("leads.state = :state", { state: LeadState.COMPLETE })
			.andWhere("leads.created_at BETWEEN :fromDate AND :toDate", {
				fromDate,
				toDate,
			})
			.groupBy("manager.id, agency.title")
			.orderBy("total", "DESC");

		if (
			user.role === RoleType.AGENT ||
			user.role === RoleType.HEAD_OF_AGENCY
		) {
			query = query.andWhere("agency.id = :agency_id", {
				agency_id: userInfo.data.agency_id,
			});
		}

		const count = await query.getCount();

		query = query.limit(limit).offset(offset);

		const metaData = BaseDto.create<ICompletedLeadsRatingResponse[]>();
		metaData.setPagination(count, page, limit);
		metaData.data =
			(await query.getRawMany()) as unknown as ICompletedLeadsRatingResponse[];

		return metaData;
	}

	async managerStatisticsByPrice(
		{ fromDate, limit, page, toDate }: TopAnalyticsDto,
		user: ICurrentUser,
	) {
		const offset = (page - 1) * limit;
		const userInfo = await this.usersService.me(user.user_id);

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
				"manager.avatar AS photo",
				"SUM(premise.price) AS total",
			])
			.groupBy("manager.id, agency.title")
			.orderBy("total", "DESC");

		if (
			user.role === RoleType.AGENT ||
			user.role === RoleType.HEAD_OF_AGENCY
		) {
			query = query.andWhere("agency.id = :agency_id", {
				agency_id: userInfo.data.agency_id,
			});
		}
		const count = await query.getCount();

		query = query.limit(limit).offset(offset);

		const metaData = BaseDto.create<ICompletedLeadsRatingResponse[]>();
		metaData.setPagination(count, page, limit);
		metaData.data =
			(await query.getRawMany()) as unknown as ICompletedLeadsRatingResponse[];

		return metaData;
	}

	async managerStatisticsByTime(
		{ fromDate, toDate, limit, page }: TopAnalyticsDto,
		user: ICurrentUser,
	) {
		const userInfo = await this.usersService.me(user.user_id);

		const offset = (page - 1) * limit;

		let query = this.leadRepository
			.createQueryBuilder("leads")
			.leftJoin("leads.manager", "manager")
			.leftJoin("manager.agency", "agency")
			.leftJoin("leads.lead_ops", "lo_won", "lo_won.status = :status", {
				status: LeadOpStatus.WON,
			})
			.select([
				"agency.title AS agency_name",
				"manager.first_name AS first_name",
				"manager.last_name AS last_name",
				"manager.avatar AS photo",
				"MIN(DATE_PART('day', lo_won.created_at - leads.created_at)) AS total",
			])
			.where("leads.created_at BETWEEN :fromDate AND :toDate", {
				fromDate,
				toDate,
			})
			.andWhere("leads.state = :state", { state: LeadState.COMPLETE })
			.groupBy("agency.title, manager.id")
			.orderBy("total", "ASC");

		if (
			user.role === RoleType.AGENT ||
			user.role === RoleType.HEAD_OF_AGENCY
		) {
			query = query.andWhere("agency.id = :agency_id", {
				agency_id: userInfo.data.agency_id,
			});
		}

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
		city_id?: number,
		user?: ICurrentUser,
		agency_id?: number,
	): Promise<number> {
		const query = this.leadRepository
			.createQueryBuilder("leads")
			.innerJoinAndSelect("leads.project", "project")
			.innerJoinAndSelect("leads.agent", "agent")
			.where("leads.created_at BETWEEN :fromDate AND :toDate", {
				fromDate,
				toDate,
			})
			.select("COUNT(leads.id)", "total_leads");

		if (status) {
			query.andWhere("leads.current_status = :status", { status });
		}

		if (city_id) {
			query.andWhere("project.city_id = :city_id", { city_id });
		}

		if (user?.role === RoleType.AGENT) {
			query.andWhere("leads.agent = :user_id", { user_id: user.user_id });
		} else if (user?.role === RoleType.HEAD_OF_AGENCY) {
			query.andWhere("agent.agency_id = :agency_id", { agency_id });
		}

		const result: { total_leads: string } | undefined =
			await query.getRawOne();

		return result ? Number(result.total_leads) : 0;
	}

	async getLeadsByCurrentStatus(
		payload: MainAnalyticsDto,
	): Promise<{ status: LeadOpStatus; total: number }[]> {
		const { fromDate, toDate, city_id } = payload;

		const query = this.leadRepository
			.createQueryBuilder("leads")
			.innerJoinAndSelect("leads.project", "project")
			.select("leads.current_status", "status")
			.addSelect("COUNT(leads.id)::INT", "total")
			.where("leads.created_at BETWEEN :fromDate AND :toDate", {
				fromDate,
				toDate,
			})
			.groupBy("leads.current_status");

		if (city_id) {
			query.andWhere("project.city_id = :city_id", { city_id });
		}

		const result: { status: LeadOpStatus; total: number }[] =
			await query.getRawMany();

		return result;
	}

	async getClientsCount(
		fromDate: Date,
		toDate: Date,
		user: ICurrentUser,
		agency_id?: number,
	): Promise<number> {
		const filter: { agent_id?: number; agent?: { agency_id?: number } } =
			{};

		if (user.role === RoleType.AGENT) {
			filter.agent_id = user.user_id;
		} else if (user.role === RoleType.HEAD_OF_AGENCY) {
			if (!filter.agent) {
				filter.agent = {};
			}
			filter.agent.agency_id = agency_id;
		}

		const result = await this.clientRepository.count({
			where: {
				created_at: Between(fromDate, toDate),
				...filter,
			},
			relations: {
				agent: true,
			},
		});

		return result;
	}

	async getTopNewsByViews(payload: TopAnalyticsDto) {
		const { fromDate, limit, page, toDate } = payload;

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

	async getTotalNewsViews(
		fromDate: Date,
		toDate: Date,
		city_id?: number,
	): Promise<number> {
		const query = this.newsViewRepository
			.createQueryBuilder("news_views")
			.innerJoinAndSelect("news_views.news", "news")
			.where("news_views.created_at BETWEEN :fromDate AND :toDate", {
				fromDate,
				toDate,
			})
			.select("COUNT(news_views.id)", "total");

		if (city_id) {
			query.andWhere(
				new Brackets((qb) => {
					qb.where("news.city_id = :city_id", {
						city_id,
					}).orWhere("news.city_id IS NULL");
				}),
			);
		}

		const result: { total: number } | undefined = await query.getRawOne();

		return result ? Number(result.total) : 0;
	}

	async getTotalNewsLikes(
		fromDate: Date,
		toDate: Date,
		city_id?: number,
	): Promise<number> {
		const query = this.newsLikeRepository
			.createQueryBuilder("news_likes")
			.innerJoinAndSelect("news_likes.news", "news")
			.where("news_likes.created_at BETWEEN :fromDate AND :toDate", {
				fromDate,
				toDate,
			})
			.select("COUNT(news_likes.id)", "total");

		if (city_id) {
			query.andWhere(
				new Brackets((qb) => {
					qb.where("news.city_id = :city_id", {
						city_id,
					}).orWhere("news.city_id IS NULL");
				}),
			);
		}

		const result: { total: number } | undefined = await query.getRawOne();

		return result ? Number(result.total) : 0;
	}

	async getTopTrainings(
		payload: TopAnalyticsDto,
	): Promise<BaseDto<TrainingEntity[]>> {
		const { fromDate, limit, page, toDate } = payload;

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

	async getTopEventsByViews(
		payload: TopAnalyticsDto,
	): Promise<BaseDto<EventsEntity[]>> {
		const { fromDate, limit, page, toDate } = payload;
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
			payload.city_id,
		);

		return data;
	}

	async getUsersByActivity(payload: UsersAnalyticsDto) {
		const data = await this.usersService.getUserCountByActivity(
			payload.fromDate,
			payload.toDate,
			payload.role,
			payload.city_id,
		);

		return data;
	}

	async getCompletedLeadsFee(
		fromDate: Date,
		toDate: Date,
		is_avg?: boolean,
		city_id?: number,
	) {
		const query = this.leadRepository
			.createQueryBuilder("leads")
			.innerJoinAndSelect("leads.agent", "agent")
			.innerJoinAndSelect("leads.project", "project")
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

		if (city_id) {
			query.andWhere("project.city_id = :city_id", { city_id });
		}

		const result: { total: number } | undefined = await query.getRawOne();

		return result ? Number(result.total) : 0;
	}

	async getEventInvitations(
		fromDate: Date,
		toDate: Date,
		city_id?: number,
	): Promise<number> {
		const filter: { event?: { city_id?: number } } = {};

		if (city_id) {
			if (!filter.event) {
				filter.event = {};
			}
			filter.event.city_id = city_id;
		}

		const result = await this.eventInvitationRepository.count({
			where: {
				created_at: Between(fromDate, toDate),
			},
			relations: {
				event: true,
			},
		});

		return result;
	}

	async getPremiseBasketLinksCount(
		fromDate: Date,
		toDate: Date,
	): Promise<number> {
		const result = await this.premiseBasketLinkRepository.count({
			where: {
				created_at: Between(fromDate, toDate),
			},
		});

		return result;
	}

	async getAveragePriceOfCompletedLeads(
		fromDate: Date,
		toDate: Date,
		user: ICurrentUser,
		agency_id?: number,
		city_id?: number,
	): Promise<number> {
		const query = this.leadRepository
			.createQueryBuilder("leads")
			.innerJoinAndSelect("leads.agent", "agent")
			.innerJoinAndSelect("leads.premise", "premise")
			.innerJoinAndSelect("leads.project", "project")
			.where("leads.state = :state", { state: LeadState.COMPLETE })
			.andWhere("leads.created_at BETWEEN :fromDate AND :toDate", {
				fromDate,
				toDate,
			})
			.select("AVG(premise.price)", "total");

		if (user?.role === RoleType.AGENT) {
			query.andWhere("leads.agent = :user_id", { user_id: user.user_id });
		} else if (user?.role === RoleType.HEAD_OF_AGENCY) {
			query.andWhere("agent.agency_id = :agency_id", { agency_id });
		}

		if (city_id) {
			query.andWhere("project.city_id = :city_id", { city_id });
		}

		const result: { total: string } | undefined = await query.getRawOne();

		return result ? Number(result.total) : 0;
	}

	async getAverageSizeOfCompletedLeads(
		fromDate: Date,
		toDate: Date,
		user: ICurrentUser,
		agency_id?: number,
		city_id?: number,
	): Promise<number> {
		const query = this.leadRepository
			.createQueryBuilder("leads")
			.innerJoinAndSelect("leads.agent", "agent")
			.innerJoinAndSelect("leads.premise", "premise")
			.innerJoinAndSelect("leads.project", "project")
			.where("leads.state = :state", { state: LeadState.COMPLETE })
			.andWhere("leads.created_at BETWEEN :fromDate AND :toDate", {
				fromDate,
				toDate,
			})
			.select("AVG(premise.size)", "total");

		if (user?.role === RoleType.AGENT) {
			query.andWhere("leads.agent = :user_id", { user_id: user.user_id });
		} else if (user?.role === RoleType.HEAD_OF_AGENCY) {
			query.andWhere("agent.agency_id = :agency_id", { agency_id });
		}

		if (city_id) {
			query.andWhere("project.city_id = :city_id", { city_id });
		}

		const result: { total: string } | undefined = await query.getRawOne();

		return result ? Number(result.total) : 0;
	}

	async getMainAnalytics(payload: MainAnalyticsDto, user: ICurrentUser) {
		const { fromDate, toDate, city_id } = payload;
		const { role, user_id } = user;

		const userInfo = await this.usersService.me(user_id);
		const { pastFromDate, pastToDate } = this.createDateRange(
			fromDate,
			toDate,
		);

		let currentPastPairs: [number, number][];

		if (role === RoleType.AGENT || role === RoleType.HEAD_OF_AGENCY) {
			currentPastPairs = await Promise.all([
				this.getDataPair(
					() =>
						this.getClientsCount(
							fromDate,
							toDate,
							user,
							userInfo.data.agency_id,
						),
					() =>
						this.getClientsCount(
							pastFromDate,
							pastToDate,
							user,
							userInfo.data.agency_id,
						),
				),
				this.getDataPair(
					() =>
						this.getLeadsCount(
							fromDate,
							toDate,
							LeadOpStatus.WON,
							city_id,
							user,
							userInfo.data.agency_id,
						),
					() =>
						this.getLeadsCount(
							pastFromDate,
							pastToDate,
							LeadOpStatus.WON,
							city_id,
							user,
							userInfo.data.agency_id,
						),
				),
				this.getDataPair(
					() =>
						this.getAveragePriceOfCompletedLeads(
							fromDate,
							toDate,
							user,
							userInfo.data.agency_id,
							city_id,
						),
					() =>
						this.getAveragePriceOfCompletedLeads(
							pastFromDate,
							pastToDate,
							user,
							userInfo.data.agency_id,
							city_id,
						),
				),
				this.getDataPair(
					() =>
						this.getAverageSizeOfCompletedLeads(
							fromDate,
							toDate,
							user,
							userInfo.data.agency_id,
							city_id,
						),
					() =>
						this.getAverageSizeOfCompletedLeads(
							pastFromDate,
							pastToDate,
							user,
							userInfo.data.agency_id,
							city_id,
						),
				),
				this.getDataPair(
					() => this.getPremiseBasketLinksCount(fromDate, toDate),
					() =>
						this.getPremiseBasketLinksCount(
							pastFromDate,
							pastToDate,
						),
				),
			]);

			const [
				clients,
				completedLeads,
				averagePriceOfCompletedLeads,
				averageSizeOfCompletedLeads,
				premiseBasketLinksCount,
			] = currentPastPairs.map(([current, past]) =>
				this.calculateDifference(current, past),
			);

			return {
				clients,
				completed_leads: completedLeads,
				complited_leads_avg_price: averagePriceOfCompletedLeads,
				complited_leads_avg_size: averageSizeOfCompletedLeads,
				premise_basket_links_count: premiseBasketLinksCount,
			};
		} else {
			currentPastPairs = await Promise.all([
				this.getDataPair(
					() => this.getTotalNewsLikes(fromDate, toDate, city_id),
					() =>
						this.getTotalNewsLikes(
							pastFromDate,
							pastToDate,
							city_id,
						),
				),
				this.getDataPair(
					() => this.getTotalNewsViews(fromDate, toDate, city_id),
					() =>
						this.getTotalNewsViews(
							pastFromDate,
							pastToDate,
							city_id,
						),
				),
				this.getDataPair(
					() =>
						this.getLeadsCount(
							fromDate,
							toDate,
							LeadOpStatus.WON,
							city_id,
							user,
							userInfo.data.agency_id,
						),
					() =>
						this.getLeadsCount(
							pastFromDate,
							pastToDate,
							LeadOpStatus.WON,
							city_id,
							user,
							userInfo.data.agency_id,
						),
				),
				this.getDataPair(
					() => this.getEventInvitations(fromDate, toDate, city_id),
					() =>
						this.getEventInvitations(
							pastFromDate,
							pastToDate,
							city_id,
						),
				),
				this.getDataPair(
					() =>
						this.getCompletedLeadsFee(
							fromDate,
							toDate,
							false,
							city_id,
						),
					() =>
						this.getCompletedLeadsFee(
							pastFromDate,
							pastToDate,
							false,
							city_id,
						),
				),
				this.getDataPair(
					() =>
						this.getCompletedLeadsFee(
							fromDate,
							toDate,
							true,
							city_id,
						),
					() =>
						this.getCompletedLeadsFee(
							pastFromDate,
							pastToDate,
							true,
							city_id,
						),
				),
				this.getDataPair(
					() =>
						this.getAveragePriceOfCompletedLeads(
							fromDate,
							toDate,
							user,
							userInfo.data.agency_id,
							city_id,
						),
					() =>
						this.getAveragePriceOfCompletedLeads(
							pastFromDate,
							pastToDate,
							user,
							userInfo.data.agency_id,
							city_id,
						),
				),
				this.getDataPair(
					() =>
						this.getAverageSizeOfCompletedLeads(
							fromDate,
							toDate,
							user,
							userInfo.data.agency_id,
							city_id,
						),
					() =>
						this.getAverageSizeOfCompletedLeads(
							pastFromDate,
							pastToDate,
							user,
							userInfo.data.agency_id,
							city_id,
						),
				),
				this.getDataPair(
					() => this.getPremiseBasketLinksCount(fromDate, toDate),
					() =>
						this.getPremiseBasketLinksCount(
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
				completedLeadsFee,
				completedLeadsFeeAvg,
				averagePriceOfCompletedLeads,
				averageSizeOfCompletedLeads,
				premiseBasketLinksCount,
			] = currentPastPairs.map(([current, past]) =>
				this.calculateDifference(current, past),
			);

			return {
				news_likes: newsLikes,
				news_views: newsViews,
				completed_leads: completedLeads,
				event_invitations: eventInvitations,
				complited_leads_fee: completedLeadsFee,
				complited_leads_fee_avg: completedLeadsFeeAvg,
				complited_leads_avg_price: averagePriceOfCompletedLeads,
				complited_leads_avg_size: averageSizeOfCompletedLeads,
				premise_basket_links_count: premiseBasketLinksCount,
			};
		}
	}

	async getLeadsCountByStatus({
		fromDate,
		toDate,
		status,
		city_id,
	}: LeadAnalyticsDto) {
		const { pastFromDate, pastToDate } = this.createDateRange(
			fromDate,
			toDate,
		);

		const currentPastPairs = await Promise.all([
			this.getDataPair(
				() => this.getLeadsCount(fromDate, toDate, status, city_id),
				() =>
					this.getLeadsCount(
						pastFromDate,
						pastToDate,
						status,
						city_id,
					),
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

	createDateRange(
		fromDate: Date,
		toDate: Date,
	): { pastToDate: Date; pastFromDate: Date } {
		fromDate = new Date(fromDate);
		toDate = new Date(toDate);

		const adjustedFromDate = new Date(fromDate.getTime() - 86400000);

		const diffInMs = toDate.getTime() - adjustedFromDate.getTime();

		const shiftedDate = new Date(adjustedFromDate.getTime() - diffInMs);

		return {
			pastToDate: adjustedFromDate,
			pastFromDate: shiftedDate,
		};
	}

	calculateDifference(current: number, past: number) {
		const difference = current - past;
		const percent = past ? ((current - past) / past) * 100 : 0;
		return { past, current, difference, percent };
	}
}
