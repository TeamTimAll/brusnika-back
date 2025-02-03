import path from "path";

import { forwardRef, Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CityEntity } from "../cities/cities.entity";
import { CityModule } from "../cities/cities.module";
import { CityService } from "../cities/cities.service";
import { UserModule } from "../user/user.module";
import { BuildingsModule } from "../buildings/buildings.module";
import { NotificationModule } from "../notification/notification.module";

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
		UserModule,
		NotificationModule,
		forwardRef(() => BuildingsModule),
	],
	controllers: [ProjectsController],
	providers: [ProjectService, CityService],
	exports: [ProjectService],
})
export class ProjectsModule {}
