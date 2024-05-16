import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { AddCommentDto } from './dtos/comment.create.dto';
import { CommentUpdateDto } from './dtos/comment.update.dto';
import { Uuid } from 'boilerplate.polyfill';


@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(CommentEntity)
        private readonly commentRepository: Repository<CommentEntity>,
    ) {}

    async getAllComments(): Promise<CommentEntity[]> {
        try {
            return await this.commentRepository.find();
        } catch (error) {
            throw new HttpException('Internal server error', 500);
        }
    }

    async addComment(commentDto: AddCommentDto): Promise<CommentEntity> {
        try {
            const newComment = this.commentRepository.create(commentDto);
            return await this.commentRepository.save(newComment);
        } catch (error : any ) {
            console.log(error.message)
            throw new HttpException('Failed to add comment', 500);
        }
    }

    async deleteComment(commentId: Uuid): Promise<CommentEntity> {
        try {
            const comment = await this.findOneComment(commentId);
            await this.commentRepository.remove(comment);
            return comment;
        } catch (error : any ) {
            console.log(error.message)
            throw new HttpException('Failed to delete comment', 500);
        }
    }

    async updateComment(updateCommentDto: CommentUpdateDto): Promise<CommentEntity> {
        try {
            const { id, comment } = updateCommentDto;
            const existingComment = await this.findOneComment(id);
            existingComment.comment = comment;
            return await this.commentRepository.save(existingComment);
        } catch (error : any ) {
            console.log(error.message)
            throw new HttpException('Failed to update comment', 500);
        }
    }

    private async findOneComment(commentId: any ): Promise<any> {
        try {
            const comment = await this.commentRepository.find(commentId)
            if (!comment) {
                throw new HttpException('Comment not found', 404);
            };

            return comment;
        } catch (error : any ) {
            console.log(error.message)
            throw new HttpException('Internal server error', 500);
        }
    }
}
