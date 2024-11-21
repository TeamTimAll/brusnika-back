import { Injectable, Logger } from "@nestjs/common";
import axios from "axios";

import { BaseDto } from "../../common/base/base_dto";
import { ConfigManager } from "../../config";

@Injectable()
export class QueueService {
	private readonly logger = new Logger("QueueService");

	constructor() {}

	public async send<T extends Pick<BaseDto, "data"> & Partial<BaseDto>>(
		data: T,
	) {
		this.logger.log(JSON.stringify(data));

		try {
			return await axios.post(ConfigManager.config.KONTUR_SEND, data);
		// eslint-disable-next-line no-empty
		} catch (error) {}
	}
}
