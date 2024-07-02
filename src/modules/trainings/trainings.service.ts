import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

import { BasicService } from "../../generic/service";
import { ICurrentUser } from "../../interfaces/current-user.interface";
import { ServiceResponse } from "../../interfaces/serviceResponse.interface";

import { CreateTrainingsDto } from "./dto/trainings.create.dto";
import { LikeTrainingsDto } from "./dto/trainings.dto";
import { UpdateTrainingsDto } from "./dto/trainings.update.dto";
import { TrainingsNotFoundError } from "./errors/TrainingsNotFound.error";
import { TrainingsCategoriesService } from "./modules/categories/categories.service";
import { CreateTrainingsCategoriesDto } from "./modules/categories/dto/categories.dto";
import { TrainingsLikesService } from "./modules/likes/likes.service";
import { TrainingsViewsService } from "./modules/views/views.service";
import { TrainingsEntity } from "./trainings.entity";

@Injectable()
export class TrainingsService extends BasicService<
	TrainingsEntity,
	CreateTrainingsDto,
	UpdateTrainingsDto
> {
	constructor(@InjectDataSource() dataSource: DataSource) {
		super("trainings", TrainingsEntity, dataSource);
	}

	@Inject()
	private trainingsLikesService!: TrainingsLikesService;

	@Inject()
	private trainingsCategoriesService!: TrainingsCategoriesService;

	@Inject()
	private trainingsViewsService!: TrainingsViewsService;

	async likeTrainings(body: LikeTrainingsDto, user: ICurrentUser) {
		const trainings = await this.repository.findOne({
			where: {
				id: body.id,
			},
		});
		if (trainings && trainings.is_like_enabled) {
			const isLiked = await this.trainingsLikesService.findOneBy({
				where: {
					trainings_id: trainings.id,
					user_id: user.user_id,
				},
			});

			if (isLiked && isLiked.data.length > 0) {
				await this.trainingsLikesService.remove(isLiked.data[0].id);
				return "Unliked";
			}

			await this.trainingsLikesService.create({
				trainings_id: trainings.id,
				user_id: user.user_id,
			});

			return "Liked";
		}
	}

	async createTrainings(dto: CreateTrainingsDto, user: ICurrentUser) {
		return this.create({
			...dto,
			user_id: user.user_id,
		});
	}

	async createTrainingsCategory(dto: CreateTrainingsCategoriesDto) {
		return this.trainingsCategoriesService.create(dto);
	}

	async getCategories() {
		return this.trainingsCategoriesService.findAll();
	}

	async r_findOne(id: string, user: ICurrentUser): Promise<unknown> {
		const findOne = await this.repository
			.createQueryBuilder("trainings")
			.leftJoinAndSelect("trainings.primary_category", "primary_category")
			.leftJoinAndSelect(
				"trainings.secondary_category",
				"secondary_category",
			)
			.loadRelationCountAndMap("trainings.likes_count", "trainings.likes")
			.loadRelationCountAndMap("trainings.views_count", "trainings.views")
			.leftJoinAndSelect(
				"trainings.likes",
				"likes",
				"likes.user_id = :user_id",
				{ user_id: user.user_id },
			)
			.where("trainings.id = :id", { id })
			.getRawAndEntities();

		if (!findOne) {
			throw new TrainingsNotFoundError(`'${id}' trainings not found`);
		}

		const isViewed = await this.trainingsViewsService.findOneBy({
			where: {
				trainings_id: id,
				user_id: user.user_id,
			},
		});

		if (!isViewed || isViewed.data.length === 0) {
			await this.trainingsViewsService.create({
				trainings_id: id,
				user_id: user.user_id,
			});
		}

		return new ServiceResponse(["trainings data"], HttpStatus.OK, [
			findOne,
		]);
	}

	async r_findAll() {
		return this.repository
			.createQueryBuilder("trainings")
			.leftJoinAndSelect("trainings.primary_category", "primary_category")
			.leftJoinAndSelect(
				"trainings.secondary_category",
				"secondary_category",
			)
			.loadRelationCountAndMap("trainings.likes_count", "trainings.likes")
			.loadRelationCountAndMap("trainings.views_count", "trainings.views")
			.getMany();
	}
}
