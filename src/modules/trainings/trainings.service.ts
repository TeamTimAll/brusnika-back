import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { LikedResponseDto } from "common/dtos/likeResponse.dto";

import { ICurrentUser } from "../../interfaces/current-user.interface";

import { CreateTrainingsDto } from "./dto/CreateTrainings.dto";
import { FilterTrainingDto } from "./dto/FilterTraining.dto";
import { LikeTrainingsDto } from "./dto/LikeTrainings.dto";
import { UpdateTrainingCategoryDto } from "./dto/UpdateTrainingCategory.dto";
import { UpdateTrainingsDto } from "./dto/UpdateTrainings.dto";
import { CreateTrainingCategoryDto } from "./dto/categories.dto";
import { TrainingCategoryEntity } from "./entities/categories.entity";
import { TrainingLikeEntity } from "./entities/likes.entity";
import { TrainingViewEntity } from "./entities/views.entity";
import { TrainingCategoryNotFoundError } from "./errors/TrainingsCategoryNotFound.error";
import { TrainingNotFoundError } from "./errors/TrainingsNotFound.error";
import { TrainingEntity } from "./trainings.entity";

@Injectable()
export class TrainingsService {
	constructor(
		@InjectRepository(TrainingEntity)
		private trainingRepository: Repository<TrainingEntity>,
	) {}

	@InjectRepository(TrainingLikeEntity)
	private trainingLikeRepository!: Repository<TrainingLikeEntity>;
	@InjectRepository(TrainingCategoryEntity)
	private trainingCategoryRepository!: Repository<TrainingCategoryEntity>;
	@InjectRepository(TrainingViewEntity)
	private trainingViewRepository!: Repository<TrainingViewEntity>;

	async toggleLike(
		body: LikeTrainingsDto,
		user: ICurrentUser,
	): Promise<LikedResponseDto> {
		const trainings = await this.trainingRepository.findOne({
			where: {
				id: body.training_id,
			},
		});
		if (trainings && trainings.is_like_enabled) {
			const isLiked = await this.trainingLikeRepository.findOne({
				where: {
					trainings_id: trainings.id,
					user_id: user.user_id,
				},
			});

			if (isLiked) {
				await this.trainingLikeRepository.delete(isLiked.id);
				return { is_liked: false };
			}

			await this.trainingLikeRepository.save({
				trainings_id: trainings.id,
				user_id: user.user_id,
			});

			return { is_liked: true };
		}
		return { is_liked: false };
	}

	async create(dto: CreateTrainingsDto, user: ICurrentUser) {
		const primaryCategory = await this.trainingCategoryRepository.findOne({
			where: { id: dto.primary_category_id },
		});
		if (!primaryCategory) {
			throw new TrainingCategoryNotFoundError(
				`primary_category_id: ${dto.primary_category_id}`,
			);
		}
		const secondCategory = await this.trainingCategoryRepository.findOne({
			where: { id: dto.second_category_id },
		});
		if (!secondCategory) {
			throw new TrainingCategoryNotFoundError(
				`second_category_id: ${dto.second_category_id}`,
			);
		}
		const training = this.trainingRepository.create(dto);
		training.user_id = user.user_id;
		return await this.trainingRepository.save(training);
	}

	createCategory(dto: CreateTrainingCategoryDto) {
		const category = this.trainingCategoryRepository.create(dto);
		return this.trainingCategoryRepository.save(category);
	}

	getCategories() {
		return this.trainingCategoryRepository.find();
	}

	async readOne(id: number, user: ICurrentUser): Promise<unknown> {
		const findOne = await this.trainingRepository
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
			throw new TrainingNotFoundError(`'${id}' trainings not found`);
		}

		const isViewed = await this.trainingViewRepository.findOne({
			where: {
				trainings_id: id,
				user_id: user.user_id,
			},
		});

		if (!isViewed) {
			await this.trainingViewRepository.save({
				trainings_id: id,
				user_id: user.user_id,
			});
		}

		return findOne;
	}

	async readAll(dto: FilterTrainingDto) {
		let trainingQuery = this.trainingRepository
			.createQueryBuilder("trainings")
			.leftJoinAndSelect("trainings.primary_category", "primary_category")
			.leftJoinAndSelect(
				"trainings.secondary_category",
				"secondary_category",
			)
			.loadRelationCountAndMap("trainings.likes_count", "trainings.likes")
			.loadRelationCountAndMap(
				"trainings.views_count",
				"trainings.views",
			);
		if (dto.category_id) {
			trainingQuery = trainingQuery.where(
				"trainings.primary_category_id = :category_id OR training.secondary_category_id = :category_id",
				{
					category_id: dto.category_id,
				},
			);
		}
		return trainingQuery.getMany();
	}

	async update(id: number, dto: UpdateTrainingsDto) {
		const foundTraining = await this.trainingRepository.findOne({
			where: {
				id: id,
			},
		});
		if (!foundTraining) {
			throw new TrainingNotFoundError(`id: ${id}`);
		}
		const mergedTraining = this.trainingRepository.merge(
			foundTraining,
			dto,
		);
		return await this.trainingRepository.save(mergedTraining);
	}

	async delete(id: number): Promise<TrainingEntity> {
		const foundTraining = await this.trainingRepository.findOne({
			where: { id: id },
		});
		if (!foundTraining) {
			throw new TrainingNotFoundError(`id: ${id}`);
		}
		await this.trainingRepository.delete(id);
		return foundTraining;
	}

	async updateCategory(id: number, dto: UpdateTrainingCategoryDto) {
		const foundCategory = await this.trainingCategoryRepository.findOne({
			where: { id: id },
		});
		if (!foundCategory) {
			throw new TrainingCategoryNotFoundError(`id: ${id}`);
		}
		const mergedCategory = this.trainingCategoryRepository.merge(
			foundCategory,
			dto,
		);
		return await this.trainingCategoryRepository.save(mergedCategory);
	}

	async deleteCategory(id: number) {
		const foundCategory = await this.trainingCategoryRepository.findOne({
			where: { id: id },
		});
		if (!foundCategory) {
			throw new TrainingCategoryNotFoundError(`id: ${id}`);
		}
		await this.trainingCategoryRepository.delete(foundCategory.id);
		return foundCategory;
	}
}
