import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserModule } from "../../modules/user/user.module";

import { ContactEntity } from "./contact.entity";
import { EventInvitionEntity } from "./event-invition.entity";
import { EventLikesEntity } from "./event-likes.entity";
import { EventViewsEntity } from "./event-views.entity";
import { EventsController } from "./events.controller";
import { EventsEntity } from "./events.entity";
import { EventsService } from "./events.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([
			EventsEntity,
			ContactEntity,
			EventViewsEntity,
			EventLikesEntity,
			EventInvitionEntity,
		]),
		UserModule,
	],
	providers: [EventsService],
	controllers: [EventsController],
	exports: [EventsService],
})
export class EventsModule {}
