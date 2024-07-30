import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { NewsViews } from "./views.entity";

@Injectable()
export class NewsViewsService {
	constructor(
		@InjectRepository(NewsViews)
		private newsViewsRepository: Repository<NewsViews>,
	) {}

	get repository(): Repository<NewsViews> {
		return this.newsViewsRepository;
	}
}
