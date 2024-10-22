import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserModule } from "../user/user.module";

import { CommentEntity } from "./comment.entity";
import { CommentsController } from "./comments.controller";
import { CommentsService } from "./comments.service";

@Module({
	imports: [TypeOrmModule.forFeature([CommentEntity]), UserModule],
	providers: [CommentsService],
	controllers: [CommentsController],
})
export class CommentsModule {}
