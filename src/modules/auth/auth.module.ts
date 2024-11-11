import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { ConfigManager } from "../../config";
import { AgenciesModule } from "../agencies/agencies.module";
import { CityModule } from "../cities/cities.module";
import { UserModule } from "../user/user.module";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { SmsService } from "./sms.service";

@Module({
	imports: [
		PassportModule,
		JwtModule.register({
			global: true,
			secret: ConfigManager.config.JWT_PRIVATE_KEY,
			signOptions: { expiresIn: "1 day" },
		}),
		UserModule,
		AgenciesModule,
		CityModule,
		SmsService,
	],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
