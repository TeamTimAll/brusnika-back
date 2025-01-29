import { BadRequestException, Injectable, Logger } from "@nestjs/common";
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
			const response = await axios.post(ConfigManager.config.KONTUR_SEND, data);
			console.log('1', response);
			if (response && response.data) {
				const responseData: any = response.data;

				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				if (responseData.response && responseData.response.error) {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
					throw new BadRequestException(responseData.response.error);
				}
			}

			return response;
		} catch (error: any) {
			console.log('1', error, error.message);

			if (error instanceof BadRequestException) {
				throw error;
			}

			throw new BadRequestException(error.message);
		}
	}
}
