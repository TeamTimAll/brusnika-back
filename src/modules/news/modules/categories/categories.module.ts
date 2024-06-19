import { Module } from "@nestjs/common";

import { NewsCategoriesService } from "./categories.service";

@Module({
	imports: [],
	providers: [NewsCategoriesService],
	exports: [NewsCategoriesService],
})
export class NewsCategoriesModule {}
