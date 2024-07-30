import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TrainingsLikes } from "./likes.entity";
import { TrainingsLikesService } from "./likes.service";

@Module({
	imports: [TypeOrmModule.forFeature([TrainingsLikes])],
	providers: [TrainingsLikesService],
	exports: [TrainingsLikesService],
})
export class TrainingsLikesModule {}
