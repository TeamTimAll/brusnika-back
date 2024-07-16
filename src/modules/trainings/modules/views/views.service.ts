import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

import { BasicService } from "../../../../generic/service";

import { TrainingsViews } from "./views.entity";
import {
	CreateTrainingsViewsDto,
	UpdateTrainingsViewsDto,
} from "./dto/views.dto";

export class TrainingsViewsService extends BasicService<
	TrainingsViews,
	CreateTrainingsViewsDto,
	UpdateTrainingsViewsDto
> {
	constructor(@InjectDataSource() dataSource: DataSource) {
		super("trainingsViews", TrainingsViews, dataSource);
	}
}
