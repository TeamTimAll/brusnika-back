import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { NewsCategories } from "./categories.entity";
import { NewsCategoriesService } from "./categories.service";

@Module({
	imports: [TypeOrmModule.forFeature([NewsCategories])],
	providers: [NewsCategoriesService],
	exports: [NewsCategoriesService],
})
export class NewsCategoriesModule {}
