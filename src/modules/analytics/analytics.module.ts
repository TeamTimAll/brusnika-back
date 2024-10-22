import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserModule } from "../user/user.module";
import { NewsEntity } from "../news/news.entity";
import { LeadsEntity } from "../leads/leads.entity";
import { LeadOpsEntity } from "../leads/lead_ops.entity";
import { NewsLikeEntity } from "../news/entities/likes.entity";
import { NewsViewEntity } from "../news/entities/views.entity";
import { TrainingEntity } from "../trainings/trainings.entity";
import { EventsEntity } from "../events/events.entity";
import { EventInvitationEntity } from "../events/entities/event-invition.entity";
import { ClientEntity } from "../client/client.entity";
import { PremiseBasketLinkEntity } from "../premises/entities";

import { AnalyticsController } from "./analytics.controller";
import { AnalyticsService } from "./analytics.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([
			NewsEntity,
			LeadsEntity,
			LeadOpsEntity,
			NewsLikeEntity,
			NewsViewEntity,
			TrainingEntity,
			EventsEntity,
			EventInvitationEntity,
			ClientEntity,
			PremiseBasketLinkEntity,
		]),
		UserModule,
	],
	controllers: [AnalyticsController],
	providers: [AnalyticsService],
	exports: [AnalyticsService],
})
export class AnalyticsModule {}
