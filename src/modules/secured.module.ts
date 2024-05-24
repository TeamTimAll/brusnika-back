import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { HealthCheckerModule } from './health-checker/health-checker.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/user.entity';
import { EventsModule } from './events/events.module';
import { ProjectsModule } from './projects/projects.module';
import { StorageModule } from './storage/storage.module';
import { CarParkingsModule } from './car-parkings/car-parkings.module';
import { CommercialBuildingsModule } from './commercial-buildings/commercial-buildings.module';
import { ApartmentsModule } from './apartments/apartments.module';
import { BuildingsModule } from './buildings/buildings.module';

@Module({
  imports: [
    UserModule,
    EventsModule,
    AuthModule,
    HealthCheckerModule,
    TypeOrmModule.forFeature([UserEntity]),
    ProjectsModule,
    StorageModule,
    CarParkingsModule,
    CommercialBuildingsModule,
    ApartmentsModule,
    BuildingsModule,
  ],
  exports: [],
})
export class SecuredModule {}
