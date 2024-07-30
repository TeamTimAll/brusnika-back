import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { TrainingsViews } from "./views.entity";

@Injectable()
export class TrainingsViewsService {
	constructor(
		@InjectRepository(TrainingsViews)
		private trainingsViewsRepository: Repository<TrainingsViews>,
	) {}

	get repository(): Repository<TrainingsViews> {
		return this.trainingsViewsRepository;
	}
}
