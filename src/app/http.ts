import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import {
	ExpressAdapter,
	NestExpressApplication,
} from "@nestjs/platform-express";
import compression from "compression";
import helmet from "helmet";
import morgan from "morgan";

import { AppModule } from "../app.module";
import { CustomValidationError } from "../common/errors/valitationError";
import { ConfigManager } from "../config";
import {
	HttpErrorFilter,
	HttpExceptionFilter,
	HttpValidationErrorFilter,
} from "../filters/bad-request.filter";
import { NodeErrorFilter } from "../filters/node-errors.filter";
import {
	QueryFailedErrorFilter,
	TypeORMErrorFilter,
} from "../filters/query-failed.filter";
import { LogColor, logColorize } from "../lib/log";

// import { AppLogger } from "./appLogger";

export type HttpApplication = NestExpressApplication;

export class Http {
	public static app: HttpApplication;

	static async init(): Promise<Http> {
		// const logger = AppLogger.init();
		this.app = await NestFactory.create<NestExpressApplication>(
			AppModule,
			new ExpressAdapter(),
			{
				cors: {
					credentials: true,
					origin: [
						"http://localhost:3000",
						"https://dashboard-brusnika.teamtim.tech",
						"https://dev-dashboard-brusnika.teamtim.tech",
					],
				},
			},
		);
		this.app.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
		this.app.use(helmet());
		this.app.use(compression());
		this.app.use(
			morgan(
				`Date:\t\t${logColorize(LogColor.GRAY_TEXT, "[:date[iso]]")}\nRemote address:\t${logColorize(LogColor.GRAY_TEXT, ":remote-addr")}\nMethod:\t\t${logColorize(LogColor.YELLOW_TEXT, ":method")} ${logColorize(LogColor.BLUE_TEXT, ":url")} ${logColorize(LogColor.GREEN_TEXT, ":status")} ${logColorize(LogColor.GRAY_TEXT, "HTTP/:http-version")}\nAgent:\t\t${logColorize(LogColor.GRAY_TEXT, ":user-agent")}\nTime:\t\t${logColorize(LogColor.YELLOW_TEXT, ":response-time ms")}\n`,
			),
		);
		this.app.enableVersioning();

		this.app.useGlobalFilters(
			new HttpValidationErrorFilter(),
			new HttpErrorFilter(),
			new QueryFailedErrorFilter(),
			new TypeORMErrorFilter(),
			new HttpExceptionFilter(),
			new NodeErrorFilter(),
		);

		this.app.useGlobalPipes(
			new ValidationPipe({
				whitelist: true,
				transform: true,
				exceptionFactory: (errors) => new CustomValidationError(errors),
			}),
		);

		return this;
	}

	static async listen() {
		const port = ConfigManager.config.SERVER_PORT;
		await this.app.listen(port);
		console.info(`server running on ${await this.app.getUrl()}`);
	}
}
