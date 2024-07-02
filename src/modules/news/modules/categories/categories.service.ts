import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

import { BasicService } from "../../../../generic/service";

import { NewsCategories } from "./categories.entity";
import { CreateNewsCategoriesDto, UpdateNewsCategoriesDto } from "./dto/categories.dto";

export class NewsCategoriesService extends BasicService<
	NewsCategories,
	CreateNewsCategoriesDto,
	UpdateNewsCategoriesDto
> {
	constructor(@InjectDataSource() dataSource: DataSource) {
		super("newsCategories", NewsCategories, dataSource);
	}
}
