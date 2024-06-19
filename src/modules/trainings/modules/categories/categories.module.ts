import { Module } from "@nestjs/common";

import { TrainingsCategoriesService } from "./categories.service";

@Module({
	imports: [],
	providers: [TrainingsCategoriesService],
	exports: [TrainingsCategoriesService],
})
export class TrainingsCategoriesModule {}
