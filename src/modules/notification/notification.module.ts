import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserModule } from "../user/user.module";

import { NotificationController } from "./notification.controller";
import { NotificationEntity } from "./notification.entity";
import { NotificationService } from "./notification.service";
import { NotificationUserEntity } from "./notification_user.entity";

@Module({
	imports: [
		TypeOrmModule.forFeature([NotificationEntity, NotificationUserEntity]),
		UserModule,
	],
	controllers: [NotificationController],
	providers: [NotificationService, Logger],
	exports: [NotificationService],
})
export class NotificationModule {}
