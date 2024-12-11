import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserModule } from "../../modules/user/user.module";
import { ClientModule } from "../client/client.module";
import { ProjectsModule } from "../projects/projects.module";
import { VisitQueueModule } from "../queues/visit/visit.module";

import { VisitsController } from "./visits.controller";
import { VisitsEntity } from "./visits.entity";
import { VisitsService } from "./visits.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([VisitsEntity]),
		UserModule,
		ProjectsModule,
		ClientModule,
		forwardRef(() => VisitQueueModule),
	],
	providers: [VisitsService],
	controllers: [VisitsController],
	exports: [VisitsService],
})
export class VisitsModule {}
