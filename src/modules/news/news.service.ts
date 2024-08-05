import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ICurrentUser } from "../../interfaces/current-user.interface";

import { CreateNewsDto } from "./dto/CreateNews.dto";
import { CreateNewsCategoriesDto } from "./dto/CreateNewsCategories.dto";
import { LikeNewsDto } from "./dto/LikeNews.dto";
import { UpdateNewsDto } from "./dto/UpdateNews.dto";
import { NewsCategoryEntity } from "./entities/categories.entity";
import { NewsLikeEntity } from "./entities/likes.entity";
import { NewsViewEntity } from "./entities/views.entity";
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

	async create(dto: CreateNewsDto, user: ICurrentUser) {
		await this.newsCategoriyRepository.findOne({
			where: { id: dto.primary_category_id },
		});
		await this.newsCategoriyRepository.findOne({
			where: { id: dto.second_category_id },
		});
		const news = this.newsRepository.create(dto);
		news.user_id = user.user_id;
		return await this.newsRepository.save(news);
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
			.where("news.id = :id", { id })
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

	async readAll() {
		return this.newsRepository
			.createQueryBuilder("news")
			.leftJoinAndSelect("news.primary_category", "primary_category")
			.leftJoinAndSelect("news.secondary_category", "secondary_category")
			.loadRelationCountAndMap("news.likes_count", "news.likes")
			.loadRelationCountAndMap("news.views_count", "news.views")
			.getMany();
	}

	async banner() {
		return this.newsRepository
			.createQueryBuilder("news")
			.leftJoinAndSelect("news.primary_category", "primary_category")
			.leftJoinAndSelect("news.secondary_category", "secondary_category")
			.loadRelationCountAndMap("news.likes_count", "news.likes")
			.loadRelationCountAndMap("news.views_count", "news.views")
			.where("news.is_banner IS TRUE")
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
