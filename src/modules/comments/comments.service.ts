import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CommentEntity } from "./comment.entity";
import { AddCommentDto } from "./dtos/comment.create.dto";
import { CommentUpdateDto } from "./dtos/comment.update.dto";

@Injectable()
export class CommentsService {
	constructor(
		@InjectRepository(CommentEntity)
		private readonly commentRepository: Repository<CommentEntity>,
	) {}

	async getAllComments(): Promise<CommentEntity[]> {
		return await this.commentRepository.find();
	}

	async addComment(commentDto: AddCommentDto): Promise<CommentEntity> {
		const newComment = this.commentRepository.create(commentDto);
		return await this.commentRepository.save(newComment);
	}

	async deleteComment(commentId: string): Promise<CommentEntity> {
		const comment = await this.findOneComment(commentId);
		await this.commentRepository.remove(comment);
		return comment;
	}

	async updateComment(
		updateCommentDto: CommentUpdateDto,
	): Promise<CommentEntity> {
		const { id, comment } = updateCommentDto;
		const existingComment = await this.findOneComment(id);
		existingComment.comment = comment;
		return await this.commentRepository.save(existingComment);
	}

	private async findOneComment(commentId: unknown): Promise<CommentEntity> {
		const queryBuilder = this.commentRepository
			.createQueryBuilder("Comments")
			.where("Comments.id = :id", { commentId });

		const comment: CommentEntity | null = await queryBuilder.getOne();

		if (!comment) {
			throw new HttpException("Comment not found", 404);
		}

		return comment;
	}
}
