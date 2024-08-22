import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, EntityManager, In, Repository } from "typeorm";

import { LikedResponseDto } from "common/dtos/likeResponse.dto";

import { RoleType } from "../../constants";
import { ICurrentUser } from "../../interfaces/current-user.interface";
import { arraysEqual } from "../../lib/array";
import { getDaysDiff } from "../../lib/date";
import { SettingsService } from "../settings/settings.service";
import { UserService } from "../user/user.service";

import {
	BulkCreateCategoryDto,
	BulkCreateTrainingDto,
	BulkDto,
	BulkUpdateCategoryDto,
	BulkUpdateTrainingDto,
} from "./dto/Bulk.dto";
import { CreateTrainingDto } from "./dto/CreateTrainings.dto";
import { FilterTrainingDto } from "./dto/FilterTraining.dto";
import { LikeTrainingsDto } from "./dto/LikeTrainings.dto";
import { UpdateTrainingCategoryDto } from "./dto/UpdateTrainingCategory.dto";
import { UpdateTrainingDto } from "./dto/UpdateTrainings.dto";
import { CreateTrainingCategoryDto } from "./dto/categories.dto";
import { TrainingCategoryEntity } from "./entities/categories.entity";
import { TrainingLikeEntity } from "./entities/likes.entity";
import { TrainingViewEntity } from "./entities/views.entity";
import { TrainingCategoryNotFoundError } from "./errors/TrainingsCategoryNotFound.error";
import { TrainingNotFoundError } from "./errors/TrainingsNotFound.error";
import { TrainingEntity } from "./trainings.entity";

interface BulkResponse<T = TrainingEntity, C = TrainingCategoryEntity> {
	trainings: T[];
	categories: C[];
}

interface BulkServiceResponse {
	create: BulkResponse;
	update: BulkResponse;
	delete: BulkResponse<number, number>;
}

@Injectable()
export class TrainingsService {
	constructor(
		@InjectRepository(TrainingEntity)
		private trainingRepository: Repository<TrainingEntity>,
		private dataSource: DataSource,
		@Inject()
		private settingsService: SettingsService,
		@Inject()
		private userService: UserService,
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

	async create(dto: CreateTrainingDto, user: ICurrentUser) {
		const foundCategory = await this.trainingCategoryRepository.findOne({
			where: { id: dto.category_id },
		});
		if (!foundCategory) {
			throw new TrainingCategoryNotFoundError(
				`category_id: ${dto.category_id}`,
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
		return this.trainingCategoryRepository.find({
			relations: {
				training: true,
			},
		});
	}

	async readOne(id: number, user: ICurrentUser): Promise<unknown> {
		const findOne = await this.trainingRepository
			.createQueryBuilder("trainings")
			.leftJoinAndSelect("trainings.category", "category")
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

	async readAll(
		dto: FilterTrainingDto,
		user: ICurrentUser,
	): Promise<TrainingEntity[]> {
		let trainingQuery = this.trainingRepository
			.createQueryBuilder("trainings")
			.leftJoinAndSelect("trainings.category", "category")
			.loadRelationCountAndMap("trainings.likes_count", "trainings.likes")
			.loadRelationCountAndMap(
				"trainings.views_count",
				"trainings.views",
			);
		if (dto.category_id) {
			trainingQuery = trainingQuery.andWhere(
				"trainings.category_id = :category_id",
				{
					category_id: dto.category_id,
				},
			);
		}
		if (user.role === RoleType.ADMIN) {
			if (!dto.include_non_actives) {
				trainingQuery = trainingQuery.andWhere(
					"trainings.is_active IS TRUE",
				);
			}
			return trainingQuery.getMany();
		}
		trainingQuery = trainingQuery.andWhere("trainings.is_active IS TRUE");
		trainingQuery = trainingQuery
			.andWhere(
				"(trainings.access_user_id IS NULL AND trainings.access_role IS NULL)",
			)
			.orWhere("trainings.access_user_id = :access_user_id", {
				access_user_id: user.user_id,
			})
			.orWhere("trainings.access_role = :access_role", {
				access_role: user.role,
			});
		const settings = await this.settingsService.read();
		const foundUser = await this.userService.repository.findOneBy({
			id: user.user_id,
		});
		const dayDiff = foundUser?.workStartDate
			? getDaysDiff(new Date(), new Date(foundUser.workStartDate))
			: 0;
		if (settings.training_show_date_limit < dayDiff) {
			trainingQuery = trainingQuery.andWhere(
				"trainings.is_show IS FALSE",
			);
		}
		return trainingQuery.getMany();
	}

	async update(id: number, dto: UpdateTrainingDto) {
		const foundTraining = await this.trainingRepository.findOne({
			where: {
				id: id,
			},
		});
		if (!foundTraining) {
			throw new TrainingNotFoundError(`id: ${id}`);
		}
		const foundCategory = await this.trainingCategoryRepository.findOne({
			where: { id: dto.category_id },
		});
		if (!foundCategory) {
			throw new TrainingCategoryNotFoundError(
				`category_id: ${dto.category_id}`,
			);
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

	async bulk(dto: BulkDto, user: ICurrentUser): Promise<BulkServiceResponse> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const createdCategories = await this.bulkCreateCategories(
				queryRunner.manager,
				dto.create.categories,
			);
			const createdTrainings = await this.bulkCreateTrainings(
				queryRunner.manager,
				dto.create.trainings,
				createdCategories,
				user,
			);
			const updatedTrainings = await this.bulkUpdateTrainings(
				queryRunner.manager,
				dto.update.trainings,
			);
			const updatedCategories = await this.bulkUpdateCategories(
				queryRunner.manager,
				dto.update.categories,
			);
			const deletedTrainings = await this.bulkDeleteTrainings(
				queryRunner.manager,
				dto.delete.trainings,
			);
			const deletedCategories = await this.bulkDeleteCategories(
				queryRunner.manager,
				dto.delete.categories,
			);
			await queryRunner.commitTransaction();
			return {
				create: {
					trainings: createdTrainings,
					categories: createdCategories,
				},
				update: {
					trainings: updatedTrainings,
					categories: updatedCategories,
				},
				delete: {
					trainings: deletedTrainings,
					categories: deletedCategories,
				},
			};
		} catch (e) {
			await queryRunner.rollbackTransaction();
			throw e;
		} finally {
			await queryRunner.release();
		}
	}

	private async bulkCreateCategories(
		manager: EntityManager,
		categories: BulkCreateCategoryDto[],
	): Promise<Array<BulkCreateCategoryDto & TrainingCategoryEntity>> {
		if (!categories.length) {
			return [];
		}
		const createdCategories: TrainingCategoryEntity[] =
			this.trainingCategoryRepository.create(categories);
		const trainingCategories = await manager.save(
			TrainingCategoryEntity,
			createdCategories,
		);
		return trainingCategories.map((t, i) => {
			const training = t as BulkCreateCategoryDto &
				TrainingCategoryEntity;
			training.ref_id = categories[i].ref_id;
			return training;
		});
	}

	private getIdsFromPrefix(
		trainings: BulkCreateTrainingDto[],
		prefix: string,
	): number[] {
		return trainings
			.filter(
				(e) =>
					typeof e.category_ref_id.split(prefix)[1] !== "undefined",
			)
			.map((e) => parseInt(e.category_ref_id.split(prefix)[1]));
	}

	private async bulkCreateTrainings(
		manager: EntityManager,
		trainings: BulkCreateTrainingDto[],
		categories: Array<BulkCreateCategoryDto & TrainingCategoryEntity>,
		user: ICurrentUser,
	): Promise<TrainingEntity[]> {
		if (!trainings.length) {
			return [];
		}
		const newCategoryIds = this.getIdsFromPrefix(trainings, "new-");
		const oldCategoryIds = this.getIdsFromPrefix(trainings, "old-");
		if (oldCategoryIds.length) {
			const foundCategories = await manager.find(TrainingCategoryEntity, {
				select: { id: true },
				where: { id: In(oldCategoryIds) },
			});
			const foundCategoryIds: number[] = foundCategories.map((e) => e.id);
			if (foundCategories.length !== oldCategoryIds.length) {
				throw new TrainingCategoryNotFoundError(
					`category_ids(old): ${[...new Set([...foundCategoryIds, ...oldCategoryIds])].join(", ")}`,
				);
			}
		}
		if (newCategoryIds.length) {
			const categoryIds: number[] = categories.map((e) =>
				parseInt(e.ref_id.split("new-")[1]),
			);
			const isCategoryIdsEqual = arraysEqual(newCategoryIds, categoryIds);
			if (!isCategoryIdsEqual) {
				throw new TrainingCategoryNotFoundError(
					`category_ids(new): ${[...new Set([...newCategoryIds, ...categoryIds])].join(", ")}`,
				);
			}
		}
		const createdTrainings: TrainingEntity[] = [];
		trainings.forEach((t) => {
			const training = this.trainingRepository.create(t);
			if (t.category_ref_id.startsWith("new-")) {
				const category = categories.find(
					(c) => c.ref_id === t.category_ref_id,
				);
				training.category_id = category!.id;
			}
			if (t.category_ref_id.startsWith("old-")) {
				training.category_id = parseInt(
					t.category_ref_id.split("old-")[1],
				);
			}
			training.user_id = user.user_id;
			createdTrainings.push(training);
		});
		return manager.save(TrainingEntity, createdTrainings);
	}

	private async bulkUpdateCategories(
		manager: EntityManager,
		categories: BulkUpdateCategoryDto[],
	) {
		if (!categories.length) {
			return [];
		}
		const categoryIds: number[] = categories.map((e) => e.id);
		const foundCategories = await manager.find(TrainingCategoryEntity, {
			where: { id: In(categoryIds) },
		});
		const foundCategoryIds: number[] = foundCategories.map((e) => e.id);
		if (foundCategoryIds.length !== categoryIds.length) {
			throw new TrainingCategoryNotFoundError(
				`ids: ${[...new Set([...foundCategoryIds, ...categoryIds])].join(", ")}`,
			);
		}
		const mergedCategories: TrainingCategoryEntity[] = [];
		foundCategories.forEach((e, i) => {
			mergedCategories.push(
				this.trainingCategoryRepository.merge(e, categories[i]),
			);
		});
		return manager.save(TrainingCategoryEntity, mergedCategories);
	}

	private async bulkUpdateTrainings(
		manager: EntityManager,
		trainings: BulkUpdateTrainingDto[],
	) {
		if (!trainings.length) {
			return [];
		}
		const trainingIds: number[] = trainings.map((e) => e.id);
		const foundTraining = await manager.find(TrainingEntity, {
			where: {
				id: In(trainingIds),
			},
		});
		const foundTrainingIds = foundTraining.map((e) => e.id);
		if (foundTrainingIds.length !== trainingIds.length) {
			throw new TrainingNotFoundError(
				`ids: ${[...new Set([...trainingIds, ...foundTrainingIds])].join(", ")}`,
			);
		}
		const categoryIds: number[] = trainings.map((e) => e.category_id);
		const foundCategories = await manager.find(TrainingCategoryEntity, {
			select: { id: true },
			where: { id: In(categoryIds) },
		});
		const foundCategoryIds: number[] = foundCategories.map((e) => e.id);
		if (foundCategories.length !== categoryIds.length) {
			throw new TrainingCategoryNotFoundError(
				`category_ids: ${[...new Set([...foundCategoryIds, ...categoryIds])].join(", ")}`,
			);
		}
		const mergedTrainings: TrainingEntity[] = [];
		foundTraining.forEach((e, i) => {
			mergedTrainings.push(
				this.trainingRepository.merge(e, trainings[i]),
			);
		});
		return manager.save(TrainingEntity, mergedTrainings);
	}

	async bulkDeleteTrainings(
		manager: EntityManager,
		trainingIds: number[],
	): Promise<number[]> {
		if (!trainingIds.length) {
			return [];
		}
		const foundTraining = await manager.find(TrainingEntity, {
			where: {
				id: In(trainingIds),
			},
		});
		const foundTrainingIds = foundTraining.map((e) => e.id);
		if (foundTrainingIds.length !== trainingIds.length) {
			throw new TrainingNotFoundError(
				`ids: ${[...new Set([...trainingIds, ...foundTrainingIds])].join(", ")}`,
			);
		}
		await manager.delete(TrainingEntity, trainingIds);
		return foundTrainingIds;
	}

	async bulkDeleteCategories(
		manager: EntityManager,
		categoryIds: number[],
	): Promise<number[]> {
		if (!categoryIds.length) {
			return [];
		}
		const foundCategories = await manager.find(TrainingCategoryEntity, {
			select: { id: true },
			where: { id: In(categoryIds) },
		});
		const foundCategoryIds: number[] = foundCategories.map((e) => e.id);
		if (foundCategories.length !== categoryIds.length) {
			throw new TrainingCategoryNotFoundError(
				`category_ids: ${[...new Set([...foundCategoryIds, ...categoryIds])].join(", ")}`,
			);
		}
		await manager.delete(TrainingCategoryEntity, categoryIds);
		return foundCategoryIds;
	}
}
