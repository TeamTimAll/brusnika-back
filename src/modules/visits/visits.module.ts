import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserModule } from "../../modules/user/user.module";

import { VisitsController } from "./visits.controller";
import { VisitsEntity } from "./visits.entity";
import { VisitsService } from "./visits.service";

@Module({
	imports: [TypeOrmModule.forFeature([VisitsEntity]), UserModule],
	providers: [VisitsService],
	controllers: [VisitsController],
	exports: [VisitsService],
})
export class VisitsModule {}
