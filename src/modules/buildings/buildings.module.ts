import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ProjectEntity } from "../../modules/projects/project.entity";
import { ProjectsModule } from "../projects/projects.module";

import { BuildingsController } from "./buildings.controller";
import { BuildingEntity } from "./buildings.entity";
import { BuildingsService } from "./buildings.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([BuildingEntity, ProjectEntity]),
		ProjectsModule,
	],
	controllers: [BuildingsController],
	providers: [BuildingsService],
	exports: [BuildingsService],
})
export class BuildingsModule {}
