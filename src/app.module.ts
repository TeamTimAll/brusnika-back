import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";
// import {
// 	makeCounterProvider,
// 	PrometheusModule,
// } from "@willsoto/nestjs-prometheus";

import { ConfigManager } from "./config";
import { SecuredModule } from "./modules/secured.module";
// import { AppService } from "./app.service";
// import { CustomLogger } from "./app/appLogger";

@Module({
	imports: [
		SecuredModule,
		TypeOrmModule.forRoot(ConfigManager.databaseConfig),
		MulterModule.register({
			dest: "../media",
		}),
		// PrometheusModule.register({
		// 	defaultLabels: {
		// 		app: "nestjs-app",
		// 	},
		// }),
	],
	providers: [
		// AppService,
		// {
		// 	provide: "LoggerService",
		// 	useClass: CustomLogger,
		// },
		// makeCounterProvider({
		// 	name: "http_requests_total", // Metrika nomi
		// 	help: "Count of HTTP requests", // Metrika haqida ma'lumot
		// }),
	],
	controllers: [],
})
export class AppModule {}
