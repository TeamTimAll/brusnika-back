import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { UserService } from 'modules/user/user.service';
import { EventsService } from 'modules/events/events.service';
import { AddCommentDto } from './dtos/comment.create.dto';
import { CommentUpdateDto } from './dtos/comment.update.dto';

import { Uuid } from 'boilerplate.polyfill';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(CommentEntity)
        private readonly commentRepository: Repository<CommentEntity>,
        private readonly userService: UserService,
        private readonly eventService: EventsService,
    ) {}


    async getAllComments(): Promise<CommentEntity[]> {
        return this.commentRepository.find();
    };


    async addComment(commentDto: AddCommentDto): Promise<CommentEntity> {
        const { userId, eventId, comment } = commentDto;

        const user = await this.userService.getUser(userId);
        if (!user) {
            throw new HttpException('User not found', 404);
        }

        const event = await this.eventService.getSingleEvents(eventId);
        if (!event) {
            throw new HttpException('Event not found', 404);
        }

        const newComment =  await this.commentRepository.create({
            user,
            event,
            comment,
        });

        return  await this.commentRepository.save(newComment);
    }

    async getEventComments(eventId: Uuid): Promise<CommentEntity[] | []> {
        const event = await this.eventService.getSingleEvents(eventId);

         if(!event.comments || event.comments.length === 0) return [] 

         return event.comments
    };

    async deleteComment(commentId: Uuid): Promise<CommentEntity> {
        const comment = await this.findOneComment(commentId);
        if (!comment) {
            throw new HttpException('Comment not found', 404);
        }

        await this.commentRepository.remove(comment);

        return comment 
    }

    async updateComment(updateCommentDto: CommentUpdateDto): Promise<CommentEntity> {
        const { id, comment } = updateCommentDto;
        const existingComment = await this.findOneComment(id);
        
        if (!existingComment) {
            throw new HttpException('Comment not found', 404);
        };


        existingComment.comment = comment;
        return   this.commentRepository.save(existingComment);
    };
    

    private async findOneComment(commentId: any ): Promise<CommentEntity> {
        const comment = await this.commentRepository.findOne(commentId);
        if (!comment) {
            throw new HttpException('Comment not found', 404);
        };

        return comment;
    }
}
