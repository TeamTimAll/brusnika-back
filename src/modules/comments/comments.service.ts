import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from './comment.entity';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(CommentEntity)
        private readonly commentRepository: Repository<CommentEntity>,
    ) {}

    async getAllComments(): Promise<CommentEntity[]> {
        return this.commentRepository.find();
    }


    async addComment () : Promise<any> {}


    async getPostComments ( ) : Promise<any> {}


    async  deleteComment() : Promise <any> {}


    async updateComment () : Promise<any> {}


};


