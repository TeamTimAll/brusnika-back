import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';



/**
 *  • 1-yangilik toifalarini tanlash
    • Yangiliklarning 2-toifasini tanlash (har bir yangilik 
      2 toifaga tegishli bo'lishi mumkin - bir ro'yxatning birinchi toifasi, 
      ikkinchi toifasi boshqasi)
    • Shaharni tanlang
    • Yangilikni "yoqtirish" yoki "maxsus yoqtirish" qobiliyati

 */
@Module({
  controllers: [NewsController],
  providers: [NewsService]
})
export class NewsModule {}
