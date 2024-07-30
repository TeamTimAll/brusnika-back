import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { ConfigManager } from "../../config";
import { AgenciesModule } from "../agencies/agencies.module";
import { CityModule } from "../cities/cities.module";
import { UserModule } from "../user/user.module";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
	imports: [
		PassportModule,
		JwtModule.register({
			global: true,
			secret: ConfigManager.config.JWT_PRIVATE_KEY,
			signOptions: { expiresIn: "24h" },
		}),
		UserModule,
		AgenciesModule,
		CityModule,
	],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
