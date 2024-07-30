import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserModule } from "../../modules/user/user.module";

import { CitiesController } from "./cities.controller";
import { CitiesEntity } from "./cities.entity";
import { CitiesService } from "./cities.service";

@Module({
	imports: [TypeOrmModule.forFeature([CitiesEntity]), UserModule],
	providers: [CitiesService],
	controllers: [CitiesController],
	exports: [CitiesService],
})
export class CitiesModule {}
