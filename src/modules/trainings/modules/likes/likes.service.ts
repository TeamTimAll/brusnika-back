import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

import { BasicService } from "../../../../generic/service";

import { TrainingsLikes } from "./likes.entity";
import { CreateTrainingsLikesDto, UpdateTrainingsLikesDto } from "./dto/likes.dto";

export class TrainingsLikesService extends BasicService<
	TrainingsLikes,
	CreateTrainingsLikesDto,
	UpdateTrainingsLikesDto
> {
	constructor(@InjectDataSource() dataSource: DataSource) {
		super("trainingsLikes", TrainingsLikes, dataSource);
	}
}
