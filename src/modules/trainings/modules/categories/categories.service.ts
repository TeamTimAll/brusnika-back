import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { TrainingsCategories } from "./categories.entity";
import { CreateTrainingsCategoriesDto } from "./dto/categories.dto";
import { TrainingsCategoryNotFoundError } from "./errors/TrainingsCategoryNotFound.error";

@Injectable()
export class TrainingsCategoriesService {
	constructor(
		@InjectRepository(TrainingsCategories)
		private trainingsCategoriesRepository: Repository<TrainingsCategories>,
	) {}

	get repository(): Repository<TrainingsCategories> {
		return this.trainingsCategoriesRepository;
	}

	async readAll() {
		return await this.trainingsCategoriesRepository.find();
	}

	async readOne(id: number) {
		const trainingsCategories =
			await this.trainingsCategoriesRepository.findOne({
				where: {
					id: id,
				},
			});
		if (!trainingsCategories) {
			throw new TrainingsCategoryNotFoundError(`id: ${id}`);
		}
		return trainingsCategories;
	}

	async create(dto: CreateTrainingsCategoriesDto) {
		const trainingsCategory =
			this.trainingsCategoriesRepository.create(dto);
		return await this.trainingsCategoriesRepository.save(trainingsCategory);
	}
}
