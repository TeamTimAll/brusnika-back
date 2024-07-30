import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { NewsViews } from "./views.entity";
import { NewsViewsService } from "./views.service";

@Module({
	imports: [TypeOrmModule.forFeature([NewsViews])],
	providers: [NewsViewsService],
	exports: [NewsViewsService],
})
export class NewsViewsModule {}
