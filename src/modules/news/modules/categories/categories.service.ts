import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { NewsCategories } from "./categories.entity";
import { CreateNewsCategoriesDto } from "./dto/categories.dto";
import { NewsCategoryNotFoundError } from "./errors/NewsCategoryNotFound.error";

@Injectable()
export class NewsCategoriesService {
	constructor(
		@InjectRepository(NewsCategories)
		private newsCategoryRepository: Repository<NewsCategories>,
	) {}

	async readAll() {
		return this.newsCategoryRepository.find();
	}

	async readOne(id: number) {
		const foundNewsCategory = await this.newsCategoryRepository.findOne({
			where: { id: id },
		});
		if (!foundNewsCategory) {
			throw new NewsCategoryNotFoundError(`id: ${id}`);
		}
		return foundNewsCategory;
	}

	async create(dto: CreateNewsCategoriesDto) {
		const newsCategory = this.newsCategoryRepository.create(dto);
		return await this.newsCategoryRepository.save(newsCategory);
	}
}
