import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AgenciesModule } from "../../modules/agencies/agencies.module";
import { CityModule } from "../../modules/cities/cities.module";
import { UserModule } from "../../modules/user/user.module";

import { ContactEntity } from "./entities/contact.entity";
import { EventInvitationEntity } from "./entities/event-invition.entity";
import { EventLikesEntity } from "./entities/event-likes.entity";
import { EventViewsEntity } from "./entities/event-views.entity";
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
			EventInvitationEntity,
		]),
		UserModule,
		AgenciesModule,
		CityModule,
	],
	providers: [EventsService],
	controllers: [EventsController],
	exports: [EventsService],
})
export class EventsModule {}
