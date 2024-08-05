import {
	Controller,
	//     HttpCode ,
	//     HttpStatus,
	Get,
	Body,
	Put,
	//     Param,
	Post,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dtos/CreateComment.dto";
import { CommentUpdateDto } from "./dtos/CommentUpdate.dto";

@Controller("comments")
@ApiTags("comments")
export class CommentsController {
	constructor(private commentsService: CommentsService) {}

	@Get()
	//      @HttpCode(HttpStatus.OK)
	async getAll() {
		return this.commentsService.getAllComments();
	}

	@Post()
	async createComment(@Body() commentBody: CreateCommentDto) {
		return this.commentsService.addComment(commentBody);
	}

	@Put()
	async updateComment(@Body() commentUpdate: CommentUpdateDto) {
		return this.commentsService.updateComment(commentUpdate);
	}
}
