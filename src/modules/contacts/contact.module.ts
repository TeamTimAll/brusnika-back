import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AnalyticsModule } from "../analytics/analytics.module";
import { CityModule } from "../cities/cities.module";
import { UserModule } from "../user/user.module";

import { ContactController } from "./contact.controller";
import { ContactEntity } from "./contact.entity";
import { ContactService } from "./contact.service";
import { ContactAddressEntity } from "./contact_address.entity";
import { ContactWorkScheduleEntity } from "./contact_work_schedule.entity";

@Module({
	imports: [
		TypeOrmModule.forFeature([
			ContactEntity,
			ContactWorkScheduleEntity,
			ContactAddressEntity,
		]),
		CityModule,
		UserModule,
		AnalyticsModule,
	],
	controllers: [ContactController],
	providers: [ContactService],
})
export class ContactModule {}
