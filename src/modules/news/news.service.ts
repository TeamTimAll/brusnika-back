import { Inject, Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

import { BasicService } from "../../generic/service";
import { ICurrentUser } from "../../interfaces/current-user.interface";

import { CreateNewsDto } from "./dto/news.create.dto";
import { LikeNewsDto } from "./dto/news.dto";
import { UpdateNewsDto } from "./dto/news.update.dto";
import { NewsNotFoundError } from "./errors/NewsNotFound.error";
import { NewsCategoriesService } from "./modules/categories/categories.service";
import { CreateNewsCategoriesDto } from "./modules/categories/dto/categories.dto";
import { NewsLikes } from "./modules/likes/likes.entity";
import { NewsLikesService } from "./modules/likes/likes.service";
import { NewsViewsService } from "./modules/views/views.service";
import { NewsEntity } from "./news.entity";

@Injectable()
export class NewsService extends BasicService<
	NewsEntity,
	CreateNewsDto,
	UpdateNewsDto
> {
	constructor(@InjectDataSource() dataSource: DataSource) {
		super("news", NewsEntity, dataSource);
	}

	@Inject()
	private newsLikesService!: NewsLikesService;

	@Inject()
	private newsCategoriesService!: NewsCategoriesService;

	@Inject()
	private newsViewsService!: NewsViewsService;

	async likeNews(body: LikeNewsDto, user: ICurrentUser) {
		const news = await this.repository.findOne({
			where: {
				id: body.id,
			},
		});
		if (news && news.is_like_enabled) {
			const isLiked = await this.newsLikesService.findOneBy<NewsLikes>({
				where: {
					news_id: news.id,
					user_id: user.user_id,
				},
			});

			if (isLiked && isLiked.data.length > 0) {
				await this.newsLikesService.remove(isLiked.data[0].id);
				return "Unliked";
			}

			await this.newsLikesService.create({
				news_id: news.id,
				user_id: user.user_id,
			});

			return "Liked";
		}
	}

	async createNews(dto: CreateNewsDto, user: ICurrentUser) {
		return this.create({
			...dto,
			user_id: user.user_id,
		});
	}

	async createNewsCategory(dto: CreateNewsCategoriesDto) {
		return this.newsCategoriesService.create(dto);
	}

	async getCategories() {
		return this.newsCategoriesService.findAll();
	}

	async r_findOne(id: number, user: ICurrentUser) {
		const findOne = await this.repository
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
			.getMany();

		if (!findOne) {
			throw new NewsNotFoundError(`'${id}' news not found`);
		}

		const isViewed = await this.newsViewsService.findOneBy({
			where: {
				news_id: id,
				user_id: user.user_id,
			},
		});

		if (!isViewed || isViewed.data.length === 0) {
			await this.newsViewsService.create({
				news_id: id,
				user_id: user.user_id,
			});
		}

		return findOne;
	}

	async r_findAll() {
		return this.repository
			.createQueryBuilder("news")
			.leftJoinAndSelect("news.primary_category", "primary_category")
			.leftJoinAndSelect("news.secondary_category", "secondary_category")
			.loadRelationCountAndMap("news.likes_count", "news.likes")
			.loadRelationCountAndMap("news.views_count", "news.views")
			.getMany();
	}
}
