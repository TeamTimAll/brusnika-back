import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, Not, Repository } from "typeorm";

import { DraftResponseDto } from "common/dtos/draftResponse.dto";

import { BaseDto } from "../../common/base/base_dto";
import { RoleType } from "../../constants";
import { ICurrentUser } from "../../interfaces/current-user.interface";
import { CityService } from "../cities/cities.service";
import { NotificationType } from "../notification/notification.entity";
import { NotificationService } from "../notification/notification.service";
import { UserEntity } from "../user/user.entity";
import { UserService } from "../user/user.service";

import { ReadAllBannerNewsDto, ToggleNewsDto } from "./dto";
import { CreateNewsDto } from "./dto/CreateNews.dto";
import { CreateNewsCategoriesDto } from "./dto/CreateNewsCategories.dto";
import { LikeNewsDto } from "./dto/LikeNews.dto";
import { NewsSearchDto } from "./dto/NewsSearch.dto";
import { UpdateNewsDto } from "./dto/UpdateNews.dto";
import { ReadAllNewsDto } from "./dto/read-all-news.dto";
import { UpdateNewsCategoryDto } from "./dto/update-news-category.dto";
import { NewsCategoryEntity } from "./entities/categories.entity";
import { NewsLikeEntity } from "./entities/likes.entity";
import { NewsViewEntity } from "./entities/views.entity";
import { NewsCategoryNotFoundError } from "./errors/NewsCategoryNotFound.error";
import { NewsLikeNotEnabledError } from "./errors/NewsLikeNotEnabled.error";
import { NewsNotFoundError } from "./errors/NewsNotFound.error";
import { NewsEntity } from "./news.entity";

interface NewsLikedResponse {
	is_liked: boolean;
}

@Injectable()
export class NewsService {
	constructor(
		@InjectRepository(NewsEntity)
		private newsRepository: Repository<NewsEntity>,
		private readonly cityService: CityService,
		private readonly notificationService: NotificationService,
		private readonly userService: UserService,
	) {}

	@InjectRepository(NewsLikeEntity)
	private newsLikeRepository!: Repository<NewsLikeEntity>;

	@InjectRepository(NewsCategoryEntity)
	private newsCategoriyRepository!: Repository<NewsCategoryEntity>;

	@InjectRepository(NewsViewEntity)
	private newsViewRepository!: Repository<NewsViewEntity>;

	async toggleLike(
		body: LikeNewsDto,
		user: ICurrentUser,
	): Promise<NewsLikedResponse> {
		const news = await this.newsRepository.findOne({
			where: {
				id: body.id,
			},
		});
		if (!news) {
			throw new NewsNotFoundError(`id: ${body.id}`);
		}
		if (!news.is_like_enabled) {
			throw new NewsLikeNotEnabledError();
		}
		const isLiked = await this.newsLikeRepository.findOne({
			where: {
				news_id: news.id,
				user_id: user.user_id,
			},
		});
		if (isLiked) {
			await this.newsLikeRepository.delete(isLiked.id);
			return { is_liked: false };
		}
		await this.newsLikeRepository.save({
			news_id: news.id,
			user_id: user.user_id,
		});
		return { is_liked: true };
	}

	async toggleDraft(dto: ToggleNewsDto): Promise<DraftResponseDto> {
		const news = await this.newsRepository.findOne({
			select: { id: true, is_draft: true, title: true },
			where: {
				id: dto.news_id,
			},
		});

		if (!news) {
			throw new NewsNotFoundError(`id: ${dto.news_id}`);
		}

		await this.newsRepository.update(news.id, {
			is_draft: !news.is_draft,
		});

		return {
			is_draft: !news.is_draft,
		};
	}

	async create(dto: CreateNewsDto, user: ICurrentUser) {
		const primaryCategory = await this.newsCategoriyRepository.findOne({
			where: { id: dto.primary_category_id },
		});

		const secondaryCategory = await this.newsCategoriyRepository.findOne({
			where: { id: dto.second_category_id },
		});

		if (!primaryCategory || !secondaryCategory) {
			throw new NewsCategoryNotFoundError();
		}

		await this.cityService.readOne(dto.city_id);

		const news = this.newsRepository.create(dto);
		news.user_id = user.user_id;
		const createdNews = await this.newsRepository.save(news);

		const userTokens = (await this.userService.repository.find({
			select: { id: true, firebase_token: true },
			where: { id: Not(user.user_id) },
		})) as Array<Pick<UserEntity, "id" | "firebase_token">>;

		await this.notificationService.sendToUsers(userTokens, {
			title: "Новости",
			description: `Новые новости созданы ${news.title}`,
			type: NotificationType.CREATED_NEWS,
			object_id: news.id,
		});

		return createdNews;
	}

	async createNewsCategory(dto: CreateNewsCategoriesDto) {
		const newsCategory = this.newsCategoriyRepository.create(dto);
		return await this.newsCategoriyRepository.save(newsCategory);
	}

	async getCategories() {
		return await this.newsCategoriyRepository.find();
	}

	async readOne(id: number, user: ICurrentUser) {
		const findOne = await this.newsRepository
			.createQueryBuilder("news")
			.leftJoinAndSelect("news.primary_category", "primary_category")
			.leftJoinAndSelect("news.secondary_category", "secondary_category")
			.loadRelationCountAndMap("news.likes_count", "news.likes")
			.loadRelationCountAndMap("news.views_count", "news.views")
			.leftJoinAndSelect(
				"news.likes",
				"likes",
				"likes.user_id = :user_id",
				{ user_id: user.user_id },
			)
			.select([
				"news.is_liked",
				"news.id",
				"news.is_active",
				"news.created_at",
				"news.updated_at",
				"news.user_id",
				"news.title",
				"news.content",
				"news.cover_image",
				"news.is_like_enabled",
				"news.is_extra_like_enabled",
				"news.extra_like_icon",
				"news.published_at",
				"news.access",
				"news.is_banner",
				"news.is_draft",
				"news.primary_category_id",
				"primary_category",
				"secondary_category",
				"news.second_category_id",
				"news.city_id",
			])
			.where("news.id = :id", { id })
			.setParameter("user_id", user.user_id)
			.getOne();

		if (!findOne) {
			throw new NewsNotFoundError(`'${id}' news not found`);
		}

		const isViewed = await this.newsViewRepository.findOne({
			where: {
				news_id: id,
				user_id: user.user_id,
			},
		});

		if (!isViewed) {
			await this.newsViewRepository.save({
				news_id: id,
				user_id: user.user_id,
			});
		}

		return findOne;
	}

	async search(
		dto: NewsSearchDto,
		user: ICurrentUser,
	): Promise<BaseDto<NewsEntity[]>> {
		const pageSize = (dto.page - 1) * dto.limit;
		let newsQuery = this.newsRepository
			.createQueryBuilder("n")
			.select(["n.id", "n.title"] as Array<`n.${keyof NewsEntity}`>)
			.where("n.is_active IS TRUE")
			.limit(dto.limit)
			.offset(pageSize);

		if (user.role !== RoleType.ADMIN) {
			newsQuery = newsQuery.andWhere("n.is_draft IS FALSE");
		}
		if (user.role !== RoleType.ADMIN) {
			newsQuery = newsQuery.andWhere("n.access = :role", {
				role: user.role,
			});
		}

		newsQuery = newsQuery.andWhere(
			new Brackets((qb) =>
				qb
					.where("n.title ILIKE :text", { text: `${dto.text}%` })
					.orWhere("n.content ILIKE :text", {
						text: `${dto.text}%`,
					}),
			),
		);

		const [news, newsCount] = await newsQuery.getManyAndCount();

		const metaData = BaseDto.create<NewsEntity[]>();
		metaData.setPagination(newsCount, dto.page, dto.limit);
		metaData.data = news;
		return metaData;
	}

	async readAll(user: ICurrentUser, payload: ReadAllNewsDto) {
		const pageSize = (payload.page - 1) * payload.limit;

		let query = this.newsRepository
			.createQueryBuilder("news")
			.leftJoinAndSelect("news.primary_category", "primary_category")
			.leftJoinAndSelect("news.secondary_category", "secondary_category")
			.loadRelationCountAndMap("news.likes_count", "news.likes")
			.loadRelationCountAndMap("news.views_count", "news.views")
			.select([
				"news.is_liked",
				"news.id",
				"news.is_active",
				"news.created_at",
				"news.updated_at",
				"news.user_id",
				"news.title",
				"news.content",
				"news.cover_image",
				"news.is_like_enabled",
				"news.is_extra_like_enabled",
				"news.extra_like_icon",
				"news.published_at",
				"news.access",
				"news.is_banner",
				"news.is_draft",
				"news.primary_category_id",
				"primary_category",
				"secondary_category",
				"news.second_category_id",
				"news.city_id",
			])
			.setParameter("user_id", user.user_id);

		if (!(user.role === RoleType.ADMIN && payload.include_non_actives)) {
			query = query.andWhere("news.is_active IS TRUE");
		}

		if (!payload.is_draft || user.role !== RoleType.ADMIN) {
			query = query.andWhere("news.is_draft IS FALSE");
		}

		if (payload.is_banner) {
			query = query.andWhere("news.is_banner IS TRUE");
		}

		if (payload.city_id) {
			query = query.andWhere(
				new Brackets((qb) => {
					qb.where("news.city_id = :city_id", {
						city_id: payload.city_id,
					}).orWhere("news.city_id IS NULL");
				}),
			);
		}

		if (user.role !== RoleType.ADMIN) {
			query = query.andWhere(
				new Brackets((qb) => {
					qb.where("news.access = :role", {
						role: user.role,
					}).orWhere("news.access IS NULL");
				}),
			);
		}

		if (payload.category_id) {
			query = query.andWhere(
				new Brackets((qb) => {
					qb.where("news.primary_category_id = :category_id", {
						category_id: payload.category_id,
					}).orWhere("news.second_category_id = :category_id", {
						category_id: payload.category_id,
					});
				}),
			);
		}

		const newsCount = await query.getCount();

		query = query
			.limit(payload.limit)
			.offset(pageSize)
			.orderBy("news.id", "DESC");

		const metaData = BaseDto.create<NewsEntity[]>();
		metaData.setPagination(newsCount, payload.page, payload.limit);
		metaData.data = await query.getMany();

		return metaData;
	}

	async banner(user: ICurrentUser, payload: ReadAllBannerNewsDto) {
		let query = this.newsRepository
			.createQueryBuilder("news")
			.leftJoinAndSelect("news.primary_category", "primary_category")
			.leftJoinAndSelect("news.secondary_category", "secondary_category")
			.loadRelationCountAndMap("news.likes_count", "news.likes")
			.loadRelationCountAndMap("news.views_count", "news.views")
			.select([
				"news.is_liked",
				"news.id",
				"news.is_active",
				"news.created_at",
				"news.updated_at",
				"news.user_id",
				"news.title",
				"news.content",
				"news.cover_image",
				"news.is_like_enabled",
				"news.is_extra_like_enabled",
				"news.extra_like_icon",
				"news.published_at",
				"news.access",
				"news.is_banner",
				"news.is_draft",
				"news.primary_category_id",
				"primary_category",
				"secondary_category",
				"news.second_category_id",
				"news.city_id",
			])
			.setParameter("user_id", user.user_id)
			.orderBy("news.created_at", "DESC")
			.where("news.is_banner IS TRUE");

		if (payload.city_id) {
			query = query.andWhere(
				"news.city_id = :city OR news.city_id IS NULL",
				{
					city: payload.city_id,
				},
			);
		}

		if (!payload.is_draft) {
			query = query.andWhere("news.is_draft IS FALSE");
		}

		return await query.getMany();
	}

	async update(id: number, dto: UpdateNewsDto) {
		const foundNews = await this.newsRepository.findOne({
			where: { id: id },
		});
		if (!foundNews) {
			throw new NewsNotFoundError(`id: ${id}`);
		}
		const mergedNews = this.newsRepository.merge(foundNews, dto);
		return await this.newsRepository.save(mergedNews);
	}

	async updateCategory(id: number, dto: UpdateNewsCategoryDto) {
		const foundCategory = await this.newsCategoriyRepository.findOne({
			where: { id: id },
		});

		if (!foundCategory) {
			throw new NewsCategoryNotFoundError(`id: ${id}`);
		}

		const mergedCategory = this.newsCategoriyRepository.merge(
			foundCategory,
			dto,
		);

		return await this.newsCategoriyRepository.save(mergedCategory);
	}

	async deleteCategory(id: number) {
		const foundCategory = await this.newsCategoriyRepository.findOne({
			where: { id: id },
		});

		if (!foundCategory) {
			throw new NewsCategoryNotFoundError(`id: ${id}`);
		}

		await this.newsCategoriyRepository.delete(foundCategory.id);

		return foundCategory;
	}

	async remove(id: number) {
		const foundEvent = await this.newsRepository.findOne({
			select: { id: true },
			where: { id },
		});

		if (!foundEvent) {
			throw new NewsNotFoundError(`id: ${id}`);
		}

		await this.newsRepository.delete(id);

		return foundEvent;
	}
}
