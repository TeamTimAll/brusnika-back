import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserModule } from "../../modules/user/user.module";

import { TrainingsCategoriesModule } from "./modules/categories/categories.module";
import { TrainingsLikesModule } from "./modules/likes/likes.module";
import { TrainingsViewsModule } from "./modules/views/views.module";
import { TrainingsController } from "./trainings.controller";
import { TrainingsEntity } from "./trainings.entity";
import { TrainingsService } from "./trainings.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([TrainingsEntity]),
		UserModule,
		TrainingsLikesModule,
		TrainingsCategoriesModule,
		TrainingsViewsModule,
	],
	controllers: [TrainingsController],
	providers: [TrainingsService],
})
export class TrainingsModule {}
