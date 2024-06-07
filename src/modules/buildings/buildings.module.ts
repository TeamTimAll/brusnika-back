import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ProjectEntity } from "../../modules/projects/project.entity";

import { BuildingsController } from "./buildings.controller";
import { BuildingsEntity } from "./buildings.entity";
import { BuildingsService } from "./buildings.service";

@Module({
	imports: [TypeOrmModule.forFeature([BuildingsEntity, ProjectEntity])],
	controllers: [BuildingsController],
	providers: [BuildingsService],
	exports: [BuildingsService],
})
export class BuildingsModule {}
