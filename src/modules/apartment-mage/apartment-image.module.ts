import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserModule } from "../user/user.module";

import { ApartmentImageController } from "./apartment-image.controller";
import { ApartmentImageEntity } from "./apartment-image.entity";
import { ApartmentImageService } from "./apartment-image.service";

@Module({
	imports: [TypeOrmModule.forFeature([ApartmentImageEntity]), UserModule],
	controllers: [ApartmentImageController],
	providers: [ApartmentImageService],
	exports: [ApartmentImageService],
})
export class ApartmentImageModule {}
