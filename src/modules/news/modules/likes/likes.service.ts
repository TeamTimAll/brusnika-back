import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

import { BasicService } from "../../../../generic/service";

import { NewsLikes } from "./likes.entity";
import { CreateNewsLikesDto, UpdateNewsLikesDto } from "./dto/likes.dto";

export class NewsLikesService extends BasicService<
	NewsLikes,
	CreateNewsLikesDto,
	UpdateNewsLikesDto
> {
	constructor(@InjectDataSource() dataSource: DataSource) {
		super("newsLikes", NewsLikes, dataSource);
	}
}
