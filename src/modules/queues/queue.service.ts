import { Injectable, Logger } from "@nestjs/common";

import { BaseDto } from "../../common/base/base_dto";

@Injectable()
export class QueueService {
	private readonly logger = new Logger("QueueService");

	constructor() {}

	public send<T extends Pick<BaseDto, "data"> & Partial<BaseDto>>(
		pattern: string,
		data: T,
	) {
		console.log(pattern);

		this.logger.log(JSON.stringify(data));
		return;
	}
}
