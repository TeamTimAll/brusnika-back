import { LoggerService } from "@nestjs/common";
import { WinstonModule } from "nest-winston";
import winston from "winston";

import { transports } from "../lib/logger/logger";

export class AppLogger {
	static init() {
		return WinstonModule.createLogger({
			format: winston.format.combine(
				winston.format.timestamp({
					format: "YYYY-MM-DD HH:mm:ss",
				}),
				winston.format.errors({ stack: true }),
				winston.format.splat(),
				winston.format.json(),
			),
			transports: [
				transports.console,
				transports.combinedFile,
				transports.errorFile,
				transports.fatalFile,
			],
		});
	}

	static initStream(logger: LoggerService) {
		return {
			write: function(message: string): void {
				// To remove the last newline character, used the `slice` function.
				logger.log(message.slice(0, -1));
			}
		};
	}
}
