import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "../user/user.module";
import { AgenciesModule } from "../agencies/agencies.module";
import { ConfigManager } from "../../config";

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

	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
