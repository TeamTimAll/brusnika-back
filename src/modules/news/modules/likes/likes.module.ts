import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { NewsLikes } from "./likes.entity";
import { NewsLikesService } from "./likes.service";

@Module({
	imports: [TypeOrmModule.forFeature([NewsLikes])],
	providers: [NewsLikesService],
	exports: [NewsLikesService],
})
export class NewsLikesModule {}
