import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TrainingsController } from "./trainings.controller";
import { TrainingsService } from "./trainings.service";
import { TrainingsEntity } from "./trainings.entity";
import { TrainingsLikesModule } from "./modules/likes/likes.module";
import { TrainingsCategoriesModule } from "./modules/categories/categories.module";
import { TrainingsViewsModule } from "./modules/views/views.module";

@Module({
	imports: [
		TypeOrmModule.forFeature([TrainingsEntity]),
		TrainingsLikesModule,
		TrainingsCategoriesModule,
		TrainingsViewsModule,
	],
	controllers: [TrainingsController],
	providers: [TrainingsService],
})
export class TrainingsModule {}
