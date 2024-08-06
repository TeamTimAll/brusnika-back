import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserModule } from "../../modules/user/user.module";

import { CityController } from "./cities.controller";
import { CityEntity } from "./cities.entity";
import { CityService } from "./cities.service";

@Module({
	imports: [TypeOrmModule.forFeature([CityEntity]), UserModule],
	providers: [CityService],
	controllers: [CityController],
	exports: [CityService],
})
export class CityModule {}
