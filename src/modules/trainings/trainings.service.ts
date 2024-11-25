import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, DataSource, EntityManager, In, Repository } from "typeorm";

import { LikedResponseDto } from "../../common/dtos/likeResponse.dto";
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
import { TrainingCategoryFilterDto } from "./dto/TrainingCategoryFilter.dto";
import { UpdateTrainingCategoryDto } from "./dto/UpdateTrainingCategory.dto";
import { UpdateTrainingDto } from "./dto/UpdateTrainings.dto";
import { CreateTrainingCategoryDto } from "./dto/categories.dto";
import { TrainingCategoryEntity } from "./entities/categories.entity";
import { TrainingLikeEntity } from "./entities/likes.entity";
import { TrainingViewEntity } from "./entities/views.entity";
import { TrainingCategoryNotFoundError } from "./errors/TrainingsCategoryNotFound.error";
import { TrainingNotFoundError } from "./errors/TrainingsNotFound.error";
import { TrainingAccess, TrainingEntity } from "./trainings.entity";

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
		if (trainings) {
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

	getCategories(dto: TrainingCategoryFilterDto, user: ICurrentUser) {
		let query = this.trainingCategoryRepository
			.createQueryBuilder("c")
			.leftJoinAndMapMany(
				"c.training",
				TrainingEntity,
				"training",
				"training.category_id = c.id" +
					(user.role === RoleType.ADMIN && dto.include_non_actives
						? ""
						: " AND training.is_active IS TRUE"),
			)
			.orderBy("c.sequnce_id", "ASC");
		if (!(user.role === RoleType.ADMIN && dto.include_non_actives)) {
			query = query.where("c.is_active IS TRUE");
		}
		return query.getMany();
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
			.leftJoinAndSelect("trainings.access_user", "access_user")
			.leftJoinAndSelect("access_user.agency", "access_user_agency")
			.loadRelationCountAndMap("trainings.likes_count", "trainings.likes")
			.loadRelationCountAndMap("trainings.views_count", "trainings.views")
			.select([
				"trainings",
				"category",
				"access_user.id",
				"access_user.firstName",
				"access_user.lastName",
				"access_user.fullName",
				"access_user.avatar",
				"access_user_agency.id",
				"access_user_agency.legalName",
			]);

		if (dto.text) {
			trainingQuery = trainingQuery.andWhere(
				new Brackets((qb) =>
					qb
						.where("trainings.title ILIKE :text", {
							text: `%${dto.text}%`,
						})
						.orWhere("trainings.content ILIKE :text", {
							text: `%${dto.text}%`,
						}),
				),
			);
		}

		if (dto.is_show) {
			trainingQuery = trainingQuery.andWhere("trainings.is_show is TRUE");
		}

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
				"(trainings.access_user_id IS NULL AND trainings.access = :access)",
				{
					access: TrainingAccess.ALL,
				},
			)
			.orWhere("trainings.access_user_id = :access_user_id", {
				access_user_id: user.user_id,
			});

		if (user.role === RoleType.AGENT) {
			trainingQuery = trainingQuery.orWhere(
				"trainings.access = :role_access",
				{
					role_access: TrainingAccess.AGENT,
				},
			);
		}

		const settings = await this.settingsService.read();
		const foundUser = await this.userService.repository.findOneBy({
			id: user.user_id,
		});

		const dayDiff = foundUser?.created_at
			? getDaysDiff(new Date(), new Date(foundUser.created_at))
			: 0;

		if (
			settings.training_show_date_limit < dayDiff &&
			user.role === RoleType.NEW_MEMBER
		) {
			trainingQuery = trainingQuery.orWhere(
				"trainings.access = :role_access",
				{
					role_access: TrainingAccess.NEW_USER,
				},
			);
		}

		return trainingQuery.getMany();
	}

	async readAllNewbie(user: ICurrentUser): Promise<TrainingEntity[]> {
		const settings = await this.settingsService.read();
		const foundUser = await this.userService.repository.findOneBy({
			id: user.user_id,
		});
		const dayDiff = foundUser?.created_at
			? getDaysDiff(new Date(), new Date(foundUser.created_at))
			: 0;
		if (settings.training_show_date_limit < dayDiff) {
			return [];
		}
		return this.trainingRepository
			.createQueryBuilder("trainings")
			.leftJoinAndSelect("trainings.category", "category")
			.leftJoinAndSelect("trainings.access_user", "access_user")
			.leftJoinAndSelect("access_user.agency", "access_user_agency")
			.loadRelationCountAndMap("trainings.likes_count", "trainings.likes")
			.loadRelationCountAndMap("trainings.views_count", "trainings.views")
			.select([
				"trainings",
				"category",
				"access_user.id",
				"access_user.firstName",
				"access_user.lastName",
				"access_user.fullName",
				"access_user.avatar",
				"access_user_agency.id",
				"access_user_agency.legalName",
			])
			.andWhere("trainings.is_show IS TRUE")
			.andWhere("trainings.access = :role_access", {
				role_access: TrainingAccess.NEW_USER,
			})
			.andWhere("trainings.is_active IS TRUE")
			.getMany();
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
				new Set(dto.delete.trainings),
			);
			const deletedCategories = await this.bulkDeleteCategories(
				queryRunner.manager,
				new Set(dto.delete.categories),
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
	): Set<number> {
		return new Set(
			trainings
				.filter(
					(e) =>
						typeof e.category_ref_id.split(prefix)[1] !==
						"undefined",
				)
				.map((e) => parseInt(e.category_ref_id.split(prefix)[1])),
		);
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
		if (oldCategoryIds.size) {
			const foundCategories = await manager.find(TrainingCategoryEntity, {
				select: { id: true },
				where: { id: In([...oldCategoryIds]) },
			});
			const foundCategoryIds: number[] = foundCategories.map((e) => e.id);
			if (foundCategories.length !== oldCategoryIds.size) {
				throw new TrainingCategoryNotFoundError(
					`category_ids(old): ${[...foundCategoryIds, ...oldCategoryIds].join(", ")}`,
				);
			}
		}
		if (newCategoryIds.size) {
			const categoryIds: number[] = categories.map((e) =>
				parseInt(e.ref_id.split("new-")[1]),
			);
			const isCategoryIdsEqual = arraysEqual(
				[...newCategoryIds],
				categoryIds,
			);
			if (!isCategoryIdsEqual) {
				throw new TrainingCategoryNotFoundError(
					`category_ids(new): ${[...newCategoryIds, ...categoryIds].join(", ")}`,
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
		const categoryIds: Set<number> = new Set(categories.map((e) => e.id));
		const foundCategories = await manager.find(TrainingCategoryEntity, {
			where: { id: In([...categoryIds]) },
		});
		const foundCategoryIds: Set<number> = new Set(
			foundCategories.map((e) => e.id),
		);
		if (foundCategoryIds.size !== categoryIds.size) {
			throw new TrainingCategoryNotFoundError(
				`ids: ${[...foundCategoryIds, ...categoryIds].join(", ")}`,
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
		const trainingIds: Set<number> = new Set(trainings.map((e) => e.id));
		const foundTraining = await manager.find(TrainingEntity, {
			where: {
				id: In([...trainingIds]),
			},
		});
		const foundTrainingIds: Set<number> = new Set(
			foundTraining.map((e) => e.id),
		);
		if (foundTrainingIds.size !== trainingIds.size) {
			throw new TrainingNotFoundError(
				`ids: ${[...trainingIds, ...foundTrainingIds].join(", ")}`,
			);
		}
		const categoryIds: Set<number> = new Set(
			trainings.map((e) => e.category_id),
		);
		const foundCategories = await manager.find(TrainingCategoryEntity, {
			select: { id: true },
			where: { id: In([...categoryIds]) },
		});
		const foundCategoryIds: Set<number> = new Set(
			foundCategories.map((e) => e.id),
		);
		if (foundCategoryIds.size !== categoryIds.size) {
			throw new TrainingCategoryNotFoundError(
				`category_ids: ${[...foundCategoryIds, ...categoryIds].join(", ")}`,
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
		trainingIds: Set<number>,
	): Promise<number[]> {
		if (!trainingIds.size) {
			return [];
		}
		const foundTraining = await manager.find(TrainingEntity, {
			where: {
				id: In([...trainingIds]),
			},
		});
		const foundTrainingIds = foundTraining.map((e) => e.id);
		if (foundTrainingIds.length !== trainingIds.size) {
			throw new TrainingNotFoundError(
				`ids: ${[...trainingIds, ...foundTrainingIds].join(", ")}`,
			);
		}
		await manager.delete(TrainingEntity, [...trainingIds]);
		return foundTrainingIds;
	}

	async bulkDeleteCategories(
		manager: EntityManager,
		categoryIds: Set<number>,
	): Promise<number[]> {
		if (!categoryIds.size) {
			return [];
		}
		const foundCategories = await manager.find(TrainingCategoryEntity, {
			select: { id: true },
			where: { id: In([...categoryIds]) },
		});
		const foundCategoryIds: number[] = foundCategories.map((e) => e.id);
		if (foundCategories.length !== categoryIds.size) {
			throw new TrainingCategoryNotFoundError(
				`category_ids: ${[...foundCategoryIds, ...categoryIds].join(", ")}`,
			);
		}
		await manager.delete(TrainingCategoryEntity, [...categoryIds]);
		return foundCategoryIds;
	}
}
