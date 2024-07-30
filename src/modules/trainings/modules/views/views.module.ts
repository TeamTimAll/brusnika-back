import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TrainingsViews } from "./views.entity";
import { TrainingsViewsService } from "./views.service";

@Module({
	imports: [TypeOrmModule.forFeature([TrainingsViews])],
	providers: [TrainingsViewsService],
	exports: [TrainingsViewsService],
})
export class TrainingsViewsModule {}
