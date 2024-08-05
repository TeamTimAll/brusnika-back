import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserModule } from "../user/user.module";

import { NotificationController } from "./notification.controller";
import { NotificationEntity } from "./notification.entity";
import { NotificationService } from "./notification.service";

@Module({
	imports: [TypeOrmModule.forFeature([NotificationEntity]), UserModule],
	controllers: [NotificationController],
	providers: [NotificationService],
	exports: [NotificationService],
})
export class NotificationModule {}
