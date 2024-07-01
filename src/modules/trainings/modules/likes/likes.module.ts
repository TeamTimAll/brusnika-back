import { Module } from "@nestjs/common";

import { TrainingsLikesService } from "./likes.service";

@Module({
	imports: [],
	providers: [TrainingsLikesService],
	exports: [TrainingsLikesService],
})
export class TrainingsLikesModule {}
