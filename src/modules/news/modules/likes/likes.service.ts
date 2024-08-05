import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { NewsLikes } from "./likes.entity";

@Injectable()
export class NewsLikesService {
	constructor(
		@InjectRepository(NewsLikes)
		private newsLikesRepository: Repository<NewsLikes>,
	) {}

	get repository(): Repository<NewsLikes> {
		return this.newsLikesRepository;
	}
}
