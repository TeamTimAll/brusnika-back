import path from "path";

import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CitiesEntity } from "../cities/cities.entity";
import { CityModule } from "../cities/cities.module";
import { CityService } from "../cities/cities.service";
import { UserEntity } from "../user/user.entity";
import { UserService } from "../user/user.service";

import { ProjectEntity } from "./project.entity";
import { ProjectsController } from "./projects.controller";
import { ProjectService } from "./projects.service";

@Module({
	imports: [
		MulterModule.register({
			dest: path.join(__dirname, "..", "media"),
		}),
		TypeOrmModule.forFeature([ProjectEntity, UserEntity, CitiesEntity]),
		CityModule,
	],
	controllers: [ProjectsController],
	providers: [ProjectService, CityService, UserService],
	exports: [ProjectService],
})
export class ProjectsModule {}
