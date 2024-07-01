import path from "path";

import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ProjectEntity } from "./project.entity";
import { ProjectsController } from "./projects.controller";
import { ProjectsService } from "./projects.service";

@Module({
	imports: [
		MulterModule.register({
			dest: path.join(__dirname, "..", "media"),
		}),

		TypeOrmModule.forFeature([ProjectEntity]),
	],
	controllers: [ProjectsController],
	providers: [ProjectsService],
	exports: [ProjectsService],
})
export class ProjectsModule {}
