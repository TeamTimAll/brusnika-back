import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CityModule } from "../cities/cities.module";
import { UserModule } from "../user/user.module";

import { BannerController } from "./banner.controller";
import { BannerEntity } from "./banner.entity";
import { BannerService } from "./banner.service";

@Module({
	imports: [TypeOrmModule.forFeature([BannerEntity]), CityModule, UserModule],
	controllers: [BannerController],
	providers: [BannerService],
	exports: [BannerService],
})
export class BannerModule {}
