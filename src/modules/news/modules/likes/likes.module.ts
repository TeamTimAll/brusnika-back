import { Module } from "@nestjs/common";

import { NewsLikesService } from "./likes.service";

@Module({
	imports: [],
	providers: [NewsLikesService],
	exports: [NewsLikesService],
})
export class NewsLikesModule {}
