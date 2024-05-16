import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsEntity } from './news.entity.dto';


@Injectable()
export class NewsService {

    constructor(  
          @InjectRepository(NewsEntity)
          private newsRepository  : Repository<NewsEntity> 

    ){}

    
    async getAllNews (){
           return this.newsRepository.find()
    }
}
