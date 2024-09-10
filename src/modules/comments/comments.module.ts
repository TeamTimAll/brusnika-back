import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AnalyticsModule } from "../analytics/analytics.module";
import { UserModule } from "../user/user.module";

import { CommentEntity } from "./comment.entity";
import { CommentsController } from "./comments.controller";
import { CommentsService } from "./comments.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([CommentEntity]),
		UserModule,
		AnalyticsModule,
	],
	providers: [CommentsService],
	controllers: [CommentsController],
})
export class CommentsModule {}
