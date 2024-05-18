import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './events.controller';
import { EventsEntity } from './events.entity';
import { EventsService } from './events.service';

@Module({

  imports: [TypeOrmModule.forFeature([EventsEntity])],
  providers: [EventsService],
  controllers: [EventsController],
  
})

export class EventsModule {}
