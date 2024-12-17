import { LoggerService } from "@nestjs/common";
import * as winston from "winston";
// import LokiTransport from "winston-loki";

export const logger = winston.createLogger({
	level: "info",
	format: winston.format.json(),
	transports: [
		// new LokiTransport({
		// 	host: "http://loki:3100",
		// 	labels: { app: "nestjs-app" },
		// }),
	],
});

export class CustomLogger implements LoggerService {
	log(message: string) {
		logger.info(message);
	}
	error(message: string, trace: string) {
		logger.error(message, { trace });
	}
	warn(message: string) {
		logger.warn(message);
	}
}
