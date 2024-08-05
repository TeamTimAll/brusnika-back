import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ICurrentUser } from "../../interfaces/current-user.interface";
import { LikedResponse } from "../events/events.service";

import { CreateTrainingsDto } from "./dto/CreateTrainings.dto";
import { LikeTrainingsDto } from "./dto/LikeTrainings.dto";
import { UpdateTrainingsDto } from "./dto/UpdateTrainings.dto";
import { TrainingsNotFoundError } from "./errors/TrainingsNotFound.error";
import { TrainingsCategoriesService } from "./modules/categories/categories.service";
import { CreateTrainingsCategoriesDto } from "./modules/categories/dto/categories.dto";
import { TrainingsLikesService } from "./modules/likes/likes.service";
import { TrainingsViewsService } from "./modules/views/views.service";
import { TrainingsEntity } from "./trainings.entity";

@Injectable()
export class TrainingsService {
	constructor(
		@InjectRepository(TrainingsEntity)
		private trainingsRepository: Repository<TrainingsEntity>,
	) {}

	@Inject()
	private trainingsLikesService!: TrainingsLikesService;
	@Inject()
	private trainingsCategoriesService!: TrainingsCategoriesService;
	@Inject()
	private trainingsViewsService!: TrainingsViewsService;

	async likeTrainings(
		body: LikeTrainingsDto,
		user: ICurrentUser,
	): Promise<LikedResponse> {
		const trainings = await this.trainingsRepository.findOne({
			where: {
				id: body.id,
			},
		});
		if (trainings && trainings.is_like_enabled) {
			const isLiked = await this.trainingsLikesService.repository.findOne(
				{
					where: {
						trainings_id: trainings.id,
						user_id: user.user_id,
					},
				},
			);

			if (isLiked) {
				await this.trainingsLikesService.repository.delete(isLiked.id);
				return { is_liked: false };
			}

			await this.trainingsLikesService.repository.save({
				trainings_id: trainings.id,
				user_id: user.user_id,
			});

			return { is_liked: true };
		}
		return { is_liked: false };
	}

	async create(dto: CreateTrainingsDto, user: ICurrentUser) {
		await this.trainingsCategoriesService.readOne(dto.primary_category_id);
		await this.trainingsCategoriesService.readOne(dto.second_category_id);
		const training = this.trainingsRepository.create(dto);
		training.user_id = user.user_id;
		return await this.trainingsRepository.save(training);
	}

	async createTrainingsCategory(dto: CreateTrainingsCategoriesDto) {
		return this.trainingsCategoriesService.create(dto);
	}

	async getCategories() {
		return this.trainingsCategoriesService.readAll();
	}

	async readOne(id: number, user: ICurrentUser): Promise<unknown> {
		const findOne = await this.trainingsRepository
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
			.getOne();

		if (!findOne) {
			throw new TrainingsNotFoundError(`'${id}' trainings not found`);
		}

		const isViewed = await this.trainingsViewsService.repository.findOne({
			where: {
				trainings_id: id,
				user_id: user.user_id,
			},
		});

		if (!isViewed) {
			await this.trainingsViewsService.repository.save({
				trainings_id: id,
				user_id: user.user_id,
			});
		}

		return findOne;
	}

	async readAll() {
		return this.trainingsRepository
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

	async update(id: number, dto: UpdateTrainingsDto) {
		const foundTraining = await this.trainingsRepository.findOne({
			where: {
				id: id,
			},
		});
		if (!foundTraining) {
			throw new TrainingsNotFoundError(`id: ${id}`);
		}
		const mergedTraining = this.trainingsRepository.merge(
			foundTraining,
			dto,
		);
		return await this.trainingsRepository.save(mergedTraining);
	}
}
