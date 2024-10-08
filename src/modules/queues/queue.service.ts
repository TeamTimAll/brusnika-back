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
			!ConfigManager.config.RMQ_CLIENT_USER ||
			!ConfigManager.config.RMQ_CLIENT_PASS ||
			!ConfigManager.config.RMQ_CLIENT_HOST ||
			!ConfigManager.config.RMQ_CLIENT_PORT
		) {
			this.logger.warn(
				"Rabbit-MQ Server not created. Please fill .env with RMQ_CLIENT_USER, RMQ_CLIENT_PASS, RMQ_CLIENT_HOST, RMQ_CLIENT_PORT",
			);
			return;
		}
		return this.client
			.send(pattern, encrypt(JSON.stringify(data)))
			.subscribe();
	}
}
