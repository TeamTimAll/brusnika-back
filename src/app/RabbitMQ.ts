import { INestMicroservice, Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

import { AppModule } from "../app.module";
import { ConfigManager } from "../config";

export class RabbitMQClient {
	private static app?: INestMicroservice;
	private static logger: Logger;

	static async init(logger: Logger) {
		this.logger = logger;
		if (
			!ConfigManager.config.RMQ_CLIENT_USER ||
			!ConfigManager.config.RMQ_CLIENT_PASS ||
			!ConfigManager.config.RMQ_CLIENT_HOST ||
			!ConfigManager.config.RMQ_CLIENT_PORT
		) {
			logger.warn(
				"Rabbit-MQ Server not created. Please fill .env with RMQ_CLIENT_USER, RMQ_CLIENT_PASS, RMQ_CLIENT_HOST, RMQ_CLIENT_PORT",
			);
			return;
		}

		this.app = await NestFactory.createMicroservice<MicroserviceOptions>(
			AppModule,
			{
				transport: Transport.RMQ,
				options: {
					urls: [
						`amqp://${ConfigManager.config.RMQ_CLIENT_USER}:${ConfigManager.config.RMQ_CLIENT_PASS}@${ConfigManager.config.RMQ_CLIENT_HOST}:${ConfigManager.config.RMQ_CLIENT_PORT}`,
					],
					queueOptions: {
						durable: false,
					},
					queue: "brusnika-crm-backend",
					// false = manual acknowledgement; true = automatic acknowledgment
					noAck: false,
					// Get one by one
					prefetchCount: 1,
				},
			},
		);

		this.app.useGlobalFilters({
			catch(exception) {
				logger.error(exception);
			},
		});

		logger.log("Connecting to Rabbit-MQ Server");
	}

	static async listen() {
		if (this.app) {
			await this.app.listen();
			this.logger.log("Rabbit MQ Connection is ready");
		}
	}
}
