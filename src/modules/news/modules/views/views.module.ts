import { Module } from "@nestjs/common";

import { NewsViewsService } from "./views.service";

@Module({
	imports: [],
	providers: [NewsViewsService],
	exports: [NewsViewsService],
})
export class NewsViewsModule {}
