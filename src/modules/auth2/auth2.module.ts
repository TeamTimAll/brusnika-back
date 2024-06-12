import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { ConfigManager } from "../../config";
import { AgenciesModule } from "../agencies/agencies.module";
import { User2Module } from "../user2/user2.module";

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
		User2Module,
		AgenciesModule,
	],

	controllers: [Auth2Controller],
	providers: [Auth2Service],
})
export class Auth2Module {}
