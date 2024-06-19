import { Module } from "@nestjs/common";

import { TrainingsViewsService } from "./views.service";

@Module({
	imports: [],
	providers: [TrainingsViewsService],
	exports: [TrainingsViewsService],
})
export class TrainingsViewsModule {}
