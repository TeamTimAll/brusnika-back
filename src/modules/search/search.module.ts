import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { BuildingEntity } from "../buildings/buildings.entity";
import { ClientEntity } from "../client/client.entity";
import { ProjectEntity } from "../projects/project.entity";

import { SearchController } from "./search.controller";
import { SearchService } from "./search.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([ClientEntity, ProjectEntity, BuildingEntity]),
	],
	controllers: [SearchController],
	providers: [SearchService],
})
export class SearchModule {}
