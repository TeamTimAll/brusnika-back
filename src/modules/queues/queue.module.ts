import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

import { ConfigManager } from "../../config";

import { QueueService } from "./queue.service";

@Module({
	imports: [
		ClientsModule.register([
			{
				name: "rabbit-mq-module",
				transport: Transport.RMQ,
				options: {
					urls: [
						`amqp://${ConfigManager.config.RMQ_SERVER_USER}:${ConfigManager.config.RMQ_SERVER_PASS}@${ConfigManager.config.RMQ_SERVER_HOST}:${ConfigManager.config.RMQ_SERVER_PORT}`,
					],
					queueOptions: {
						durable: false,
					},
					queue: "kontur-server",
				},
			},
		]),
	],
	providers: [QueueService],
	exports: [QueueService],
})
export class QueueModule {}
