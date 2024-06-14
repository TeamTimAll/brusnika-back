import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { ConfigManager } from "../../config";
import { AgenciesModule } from "../agencies/agencies.module";
import { UserModule } from "../user/user.module";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { Auth2Controller } from "./auth2.controller";
import { Auth2Service } from "./auth2.service";

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
	],

	controllers: [AuthController, Auth2Controller],
	providers: [AuthService, Auth2Service],
})
export class AuthModule {}
