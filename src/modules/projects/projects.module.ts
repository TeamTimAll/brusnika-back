import path from "path";

import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AgenciesModule } from "../agencies/agencies.module";
import { AnalyticsModule } from "../analytics/analytics.module";
import { CityEntity } from "../cities/cities.entity";
import { CityModule } from "../cities/cities.module";
import { CityService } from "../cities/cities.service";
import { UserModule } from "../user/user.module";

import { ProjectEntity } from "./project.entity";
import { ProjectsController } from "./projects.controller";
import { ProjectService } from "./projects.service";

@Module({
	imports: [
		MulterModule.register({
			dest: path.join(__dirname, "..", "media"),
		}),
		TypeOrmModule.forFeature([ProjectEntity, CityEntity]),
		CityModule,
		AgenciesModule,
		UserModule,
		AnalyticsModule,
	],
	controllers: [ProjectsController],
	providers: [ProjectService, CityService],
	exports: [ProjectService],
})
export class ProjectsModule {}
