import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import axios from "axios";

import { BaseDto } from "../../common/base/base_dto";
import { ConfigManager } from "../../config";
import { BaseError } from "../../common/base/baseError";
import { PromptType } from "../../lib/prompt/prompt";

@Injectable()
export class QueueService {
	private readonly logger = new Logger("QueueService");

	constructor() {
	}

	public async send<T extends Pick<BaseDto, "data"> & Partial<BaseDto>>(
		data: T,
	) {
		this.logger.log(JSON.stringify(data));

		try {
			const response = await axios.post(ConfigManager.config.KONTUR_SEND, data);
			console.log("1", response);
			if (response && response.data) {
				const responseData: any = response.data;

				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				if (responseData.response && responseData.response.error) {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
					throw new BaseError(
						0,
						{ message: responseData.response.error },
						HttpStatus.BAD_REQUEST,
						PromptType.APPLICATION,
						undefined,
						responseData.response.error,
					);
				}
			}

			return response;
		} catch (error: any) {
			console.log("2", error.message);

			if (error instanceof BaseError) {
				throw error;
			}

			throw new BaseError(
				0,
				{ message: error.message },
				HttpStatus.BAD_REQUEST,
				PromptType.APPLICATION,
				undefined,
				error.message,
			);
		}
	}
}
