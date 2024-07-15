import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

import { BasicService } from "../../../../generic/service";

import { TrainingsCategories } from "./categories.entity";
import {
	CreateTrainingsCategoriesDto,
	UpdateTrainingsCategoriesDto,
} from "./dto/categories.dto";

export class TrainingsCategoriesService extends BasicService<
	TrainingsCategories,
	CreateTrainingsCategoriesDto,
	UpdateTrainingsCategoriesDto
> {
	constructor(@InjectDataSource() dataSource: DataSource) {
		super("trainingsCategories", TrainingsCategories, dataSource);
	}
}
