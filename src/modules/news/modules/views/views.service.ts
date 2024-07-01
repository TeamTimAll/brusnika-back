import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

import { BasicService } from "../../../../generic/service";

import { NewsViews } from "./views.entity";
import { CreateNewsViewsDto, UpdateNewsViewsDto } from "./dto/views.dto";

export class NewsViewsService extends BasicService<
	NewsViews,
	CreateNewsViewsDto,
	UpdateNewsViewsDto
> {
	constructor(@InjectDataSource() dataSource: DataSource) {
		super("newsViews", NewsViews, dataSource);
	}
}
