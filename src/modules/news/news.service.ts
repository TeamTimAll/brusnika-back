import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsEntity } from './news.entity.dto';
import { Uuid } from 'boilerplate.polyfill';
import { CreateNewsDto } from './dto/news.create.dto';
import { UpdateNewsDto } from './dto/news.update.dto';

@Injectable()
export class NewsService {
    constructor(  
          @InjectRepository(NewsEntity)
          private newsRepository  : Repository<NewsEntity> 
    ){}


    async getAllNews () : Promise<NewsEntity[]>{
           return this.newsRepository.find()
    };

    async createNews( newsCreateDto :  CreateNewsDto ) : Promise<NewsEntity > {
            try {

                const createdNews : NewsEntity = await this.newsRepository.save(newsCreateDto)
                return createdNews;
                
                
            } catch (error : any ) {
                console.log(error.message)
                throw  new HttpException("Something went wrong" , 500)
            }
    };

    

    async getOneNews( id : Uuid) : Promise<NewsEntity | null> {
            try {
                
                const queryBuilder = this.newsRepository.createQueryBuilder(
                    'News',
                  ).where('News.id = :id', { id });
                  const gotNews  : NewsEntity | null = await queryBuilder.getOne();
                  return gotNews
 
            } catch (error : any ) {
                console.log({
                      newsError : error.message 
                })
                throw  new HttpException("Something went wrong " , 500)
            }
    }


    async updateNews(updateNewsBody: UpdateNewsDto): Promise<NewsEntity> {
        try {

          const news = await this.getOneNews(updateNewsBody.id);

          if(!news) throw new HttpException("News not found " , 404)
          const updatedNews = await this.newsRepository.merge(news , updateNewsBody);
          return updatedNews;

        } catch (error : any ) {
            console.log({
                updatingNews : error
            })
          throw new HttpException('Something went wrong',500);
        }
      }
 
      async deleteNews(  newsId : Uuid) : Promise<void>{
            try {
                const news = await this.getOneNews(newsId)

                if(!news){
                      throw new HttpException("News not found" , 404)
                }
                await this.newsRepository.remove(news);
                
            } catch (error : any ) {
               
                throw    new HttpException("Something went wrong ", 500)
            }
      }
}

