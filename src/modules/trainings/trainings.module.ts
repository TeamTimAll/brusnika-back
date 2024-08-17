import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SettingsModule } from "../settings/settings.module";
import { UserModule } from "../user/user.module";

import { TrainingCategoryEntity } from "./entities/categories.entity";
import { TrainingLikeEntity } from "./entities/likes.entity";
import { TrainingViewEntity } from "./entities/views.entity";
import { TrainingController } from "./trainings.controller";
import { TrainingEntity } from "./trainings.entity";
import { TrainingsService } from "./trainings.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([
			TrainingEntity,
			TrainingCategoryEntity,
			TrainingViewEntity,
			TrainingLikeEntity,
		]),
		UserModule,
		SettingsModule,
	],
	controllers: [TrainingController],
	providers: [TrainingsService],
})
export class TrainingModule {}
