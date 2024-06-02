import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectionsController } from './sections.controller';
import { SectionsEntity } from './sections.entity';
import { SectionsService } from './sections.service';

@Module({
  imports: [TypeOrmModule.forFeature([SectionsEntity])],
  providers: [SectionsService],
  controllers: [SectionsController],
})
export class SectionsModule {}
