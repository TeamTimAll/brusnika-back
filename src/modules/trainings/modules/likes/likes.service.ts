import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { TrainingsLikes } from "./likes.entity";

@Injectable()
export class TrainingsLikesService {
	constructor(
		@InjectRepository(TrainingsLikes)
		private trainingsLikesRepository: Repository<TrainingsLikes>,
	) {}

	get repository(): Repository<TrainingsLikes> {
		return this.trainingsLikesRepository;
	}
}
