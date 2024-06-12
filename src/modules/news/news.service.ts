import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

import { BasicService } from "../../generic/service";

import { NewsEntity } from "./news.entity";
import { CreateNewsDto } from "./dto/news.create.dto";
import { UpdateNewsDto } from "./dto/news.update.dto";

@Injectable()
export class NewsService extends BasicService<
	NewsEntity,
	CreateNewsDto,
	UpdateNewsDto
> {
	constructor(@InjectDataSource() dataSource: DataSource) {
		super("news", NewsEntity, dataSource);
	}
}
