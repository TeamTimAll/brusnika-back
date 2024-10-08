import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

import { BaseDto } from "../../common/base/base_dto";
import { ConfigManager } from "../../config";
import { encrypt } from "../../lib/crypto";

@Injectable()
export class QueueService {
	private readonly logger = new Logger("QueueService");

	constructor(
		@Inject("rabbit-mq-module") private readonly client: ClientProxy,
	) {}

	public send<T extends Pick<BaseDto, "data"> & Partial<BaseDto>>(
		pattern: string,
		data: T,
	) {
		if (
			!ConfigManager.config.RMQ_SERVER_USER ||
			!ConfigManager.config.RMQ_SERVER_PASS ||
			!ConfigManager.config.RMQ_SERVER_HOST ||
			!ConfigManager.config.RMQ_SERVER_PORT
		) {
			this.logger.warn(
				"Rabbit-MQ Server not created. Please fill .env with RMQ_SERVER_USER, RMQ_SERVER_PASS, RMQ_SERVER_HOST, RMQ_SERVER_PORT",
			);
			return;
		}
		this.logger.log(JSON.stringify(data));
		return this.client
			.send(pattern, encrypt(JSON.stringify(data)))
			.subscribe();
	}
}
