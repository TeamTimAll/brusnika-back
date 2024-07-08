import path from "path";

import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CitiesService } from "../cities/cities.service";
import { UserEntity } from "../user/user.entity";
import { UserService } from "../user/user.service";

import { ProjectEntity } from "./project.entity";
import { ProjectsController } from "./projects.controller";
import { ProjectsService } from "./projects.service";

@Module({
	imports: [
		MulterModule.register({
			dest: path.join(__dirname, "..", "media"),
		}),

		TypeOrmModule.forFeature([ProjectEntity, UserEntity]),
	],
	controllers: [ProjectsController],
	providers: [ProjectsService, CitiesService, UserService],
	exports: [ProjectsService],
})
export class ProjectsModule {}
