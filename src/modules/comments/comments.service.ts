import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CommentEntity } from "./comment.entity";
import { CreateCommentDto } from "./dtos/CreateComment.dto";
import { UpdateCommentDto } from "./dtos/UpdateComment.dto";
import { CommentNotFoundError } from "./errors/CommentNotFound.error";

@Injectable()
export class CommentsService {
	constructor(
		@InjectRepository(CommentEntity)
		private readonly commentRepository: Repository<CommentEntity>,
	) {}

	async readAll(): Promise<CommentEntity[]> {
		return await this.commentRepository.find();
	}

	async create(dto: CreateCommentDto): Promise<CommentEntity> {
		const comment = this.commentRepository.create(dto);
		return await this.commentRepository.save(comment);
	}

	async delete(id: number): Promise<CommentEntity> {
		const foundComment = await this.readOne(id);
		await this.commentRepository.delete(foundComment.id);
		return foundComment;
	}

	async update(id: number, dto: UpdateCommentDto): Promise<CommentEntity> {
		const foundComment = await this.readOne(id);
		const mergedComment = this.commentRepository.merge(foundComment, dto);
		return await this.commentRepository.save(mergedComment);
	}

	private async readOne(id: number): Promise<CommentEntity> {
		const foundComment = await this.commentRepository.findOne({
			where: { id: id },
		});
		if (!foundComment) {
			throw new CommentNotFoundError(`id: ${id}`);
		}
		return foundComment;
	}
}
