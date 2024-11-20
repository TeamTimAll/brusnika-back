import { Injectable, Logger } from "@nestjs/common";
import axios from "axios";

import { BaseDto } from "../../common/base/base_dto";
// import { encrypt } from "../../lib/crypto";

@Injectable()
export class QueueService {
	private readonly logger = new Logger("QueueService");

	constructor() {}

	public async send<T extends Pick<BaseDto, "data"> & Partial<BaseDto>>(
		data: T,
	) {
		this.logger.log(JSON.stringify(data));

		return await axios.post(
			"http://localhost:3001/logs/crm/",
			data
			// encrypt(JSON.stringify(data)),
		);
	}
}
