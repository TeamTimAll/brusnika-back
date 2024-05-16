import { Controller, Get } from '@nestjs/common';
import { NewsService } from './news.service';


@Controller('news')
export class NewsController {
     constructor( private newsService : NewsService) {}

    @Get()
    async getAllNews(){
          return this.newsService.getAllNews()
    }
}





