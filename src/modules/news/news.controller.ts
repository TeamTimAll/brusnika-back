import { Controller, Get , Body , Post  , Put  } from '@nestjs/common';
import { NewsService } from './news.service';
import { UpdateNewsDto } from './dto/news.update.dto';
import { ApiTags } from '@nestjs/swagger';


@Controller('news')
@ApiTags('news')
export class NewsController {
     constructor( private newsService : NewsService) {}

    @Get()
    async getAllNews(){
          return this.newsService.getAllNews()
    };

   
    @Post()
    async createNews(@Body()  newsBody : any ) {
        return this.newsService.createNews(newsBody)
    }
    

    @Put()
    async updateNews(@Body() updateNewsBody : UpdateNewsDto ) {
        return this.newsService.updateNews(updateNewsBody)
    }
}





