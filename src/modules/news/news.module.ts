import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { NewsController } from "./news.controller";
import { NewsService } from "./news.service";
import { NewsEntity } from "./news.entity";
import { NewsLikesModule } from "./modules/likes/likes.module";
import { NewsCategoriesModule } from "./modules/categories/categories.module";
import { NewsViewsModule } from "./modules/views/views.module";

@Module({
	imports: [
		TypeOrmModule.forFeature([NewsEntity]),
		NewsLikesModule,
		NewsCategoriesModule,
		NewsViewsModule,
	],
	controllers: [NewsController],
	providers: [NewsService],
})
export class NewsModule {}
