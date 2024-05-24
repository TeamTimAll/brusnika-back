import { Module } from '@nestjs/common';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageEntity } from './storage.entity';

@Module({
  imports : [
    TypeOrmModule.forFeature([
        StorageEntity
    ])
  ],
  controllers: [StorageController],
  providers: [StorageService]
})
export class StorageModule {}
