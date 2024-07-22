import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContactEntity } from "./contact.entity";
import { EventsController } from "./events.controller";
import { EventsEntity } from "./events.entity";
import { EventsService } from "./events.service";

@Module({
	imports: [TypeOrmModule.forFeature([EventsEntity, ContactEntity])],
	providers: [EventsService],
	controllers: [EventsController],
	exports: [EventsService],
})
export class EventsModule {}
