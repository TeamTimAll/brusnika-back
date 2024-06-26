import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { VisitsController } from "./visits.controller";
import { VisitsEntity } from "./visits.entity";
import { VisitsService } from "./visits.service";

@Module({
	imports: [TypeOrmModule.forFeature([VisitsEntity])],
	providers: [VisitsService],
	controllers: [VisitsController],
})
export class VisitsModule {}
