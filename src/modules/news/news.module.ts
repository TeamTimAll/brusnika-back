import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserModule } from "../../modules/user/user.module";

import { NewsCategoryEntity } from "./entities/categories.entity";
import { NewsLikeEntity } from "./entities/likes.entity";
import { NewsViewEntity } from "./entities/views.entity";
import { NewsController } from "./news.controller";
import { NewsEntity } from "./news.entity";
import { NewsService } from "./news.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([
			NewsEntity,
			NewsCategoryEntity,
			NewsLikeEntity,
			NewsViewEntity,
		]),
		UserModule,
	],
	controllers: [NewsController],
	providers: [NewsService],
	exports: [NewsService],
})
export class NewsModule {}
