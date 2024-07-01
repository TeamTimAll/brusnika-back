import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { NewsCategoriesModule } from "./modules/categories/categories.module";
import { NewsLikesModule } from "./modules/likes/likes.module";
import { NewsViewsModule } from "./modules/views/views.module";
import { NewsController } from "./news.controller";
import { NewsEntity } from "./news.entity";
import { NewsService } from "./news.service";

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
