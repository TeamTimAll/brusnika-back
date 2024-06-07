import { ValidationPipe } from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";
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

export type HttpApplication = NestExpressApplication;

export class Http {
	public static app: HttpApplication;

	static async init(): Promise<Http> {
		this.app = await NestFactory.create<NestExpressApplication>(
			AppModule,
			new ExpressAdapter(),
			{ cors: true },
		);
		this.app.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
		this.app.use(helmet());
		this.app.use(compression());
		this.app.use(morgan("combined"));
		this.app.enableVersioning();

		const reflector = this.app.get(Reflector);

		this.app.useGlobalFilters(
			new HttpValidationErrorFilter(reflector),
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
