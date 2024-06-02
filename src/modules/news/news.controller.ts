import { Controller, Get , Body , Post  , Put, UseInterceptors, UploadedFile  } from '@nestjs/common';
import { NewsService } from './news.service';
import { UpdateNewsDto } from './dto/news.update.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

@Controller('news')
@ApiTags('news')
export class NewsController {
     constructor( private newsService : NewsService) {}

    @Get()
    async getAllNews(){
          return this.newsService.getAllNews()
    };

   
    @Post()
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
              destination: './media',
              filename: (_, file, cb) => {
                const filename: string = uuidv4() + '-' + file.originalname;
                cb(null, filename);
              },
            }),
          }),
    )
    
    async createNews(@Body()  newsBody : any ,
     @UploadedFile() file : Express.Multer.File ) {
        return this.newsService.createNews(newsBody, file.originalname)
    }
    

    @Put()
    async updateNews(@Body() updateNewsBody : UpdateNewsDto ) {
        return this.newsService.updateNews(updateNewsBody)
    }
}





