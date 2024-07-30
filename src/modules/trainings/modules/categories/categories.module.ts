import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TrainingsCategories } from "./categories.entity";
import { TrainingsCategoriesService } from "./categories.service";

@Module({
	imports: [TypeOrmModule.forFeature([TrainingsCategories])],
	providers: [TrainingsCategoriesService],
	exports: [TrainingsCategoriesService],
})
export class TrainingsCategoriesModule {}
