import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ICurrentUser } from "../../interfaces/current-user.interface";

import { CreateNewsDto } from "./dto/news.create.dto";
import { LikeNewsDto } from "./dto/news.dto";
import { UpdateNewsDto } from "./dto/news.update.dto";
import { NewsLikeNotEnabledError } from "./errors/NewsLikeNotEnabled.error";
import { NewsNotFoundError } from "./errors/NewsNotFound.error";
import { NewsCategoriesService } from "./modules/categories/categories.service";
import { CreateNewsCategoriesDto } from "./modules/categories/dto/categories.dto";
import { NewsLikesService } from "./modules/likes/likes.service";
import { NewsViewsService } from "./modules/views/views.service";
import { NewsEntity } from "./news.entity";

interface NewsLikedResponse {
	is_liked: boolean;
}

@Injectable()
export class NewsService {
	constructor(
		@InjectRepository(NewsEntity)
		private newsRepository: Repository<NewsEntity>,
	) {}

	@Inject()
	private newsLikesService!: NewsLikesService;

	@Inject()
	private newsCategoriesService!: NewsCategoriesService;

	@Inject()
	private newsViewsService!: NewsViewsService;

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
		const isLiked = await this.newsLikesService.repository.findOne({
			where: {
				news_id: news.id,
				user_id: user.user_id,
			},
		});
		if (isLiked) {
			await this.newsLikesService.repository.delete(isLiked.id);
			return { is_liked: false };
		}
		await this.newsLikesService.repository.save({
			news_id: news.id,
			user_id: user.user_id,
		});
		return { is_liked: true };
	}

	async create(dto: CreateNewsDto, user: ICurrentUser) {
		await this.newsCategoriesService.readOne(dto.primary_category_id);
		await this.newsCategoriesService.readOne(dto.second_category_id);
		const news = this.newsRepository.create(dto);
		news.user_id = user.user_id;
		return await this.newsRepository.save(news);
	}

	async createNewsCategory(dto: CreateNewsCategoriesDto) {
		return this.newsCategoriesService.create(dto);
	}

	async getCategories() {
		return this.newsCategoriesService.readAll();
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
			.where("news.id = :id", { id })
			.getOne();

		if (!findOne) {
			throw new NewsNotFoundError(`'${id}' news not found`);
		}

		const isViewed = await this.newsViewsService.repository.findOne({
			where: {
				news_id: id,
				user_id: user.user_id,
			},
		});

		if (!isViewed) {
			await this.newsViewsService.repository.save({
				news_id: id,
				user_id: user.user_id,
			});
		}

		return findOne;
	}

	async readAll() {
		return this.newsRepository
			.createQueryBuilder("news")
			.leftJoinAndSelect("news.primary_category", "primary_category")
			.leftJoinAndSelect("news.secondary_category", "secondary_category")
			.loadRelationCountAndMap("news.likes_count", "news.likes")
			.loadRelationCountAndMap("news.views_count", "news.views")
			.getMany();
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
}
