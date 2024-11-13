import { randomUUID } from "crypto";

import { Injectable } from "@nestjs/common";
import axios from "axios";

import { ConfigManager } from "../../config";

@Injectable()
export class SmsService {
	private readonly smsApi: string;
	private readonly smsApiKey: string;
	constructor() {
		this.smsApi = ConfigManager.config.SMS_API_URL;
		this.smsApiKey = ConfigManager.config.SMS_API_KEY;
	}

	async sendMessage(code: number, phone_number: string) {
		const body = {
			requestId: randomUUID(),
			cascadeId: "5190",
			subscriberFilter: {
				address: phone_number,
				type: "PHONE",
			},
			content: {
				smsContent: {
					text: `${code} - ваш код авторизации в кабинете Брусника.Агент`,
				},
			},
		};

		const response = await axios.post(
			`${this.smsApi}/api/cascade/schedule`,
			body,
			{
				headers: {
					"X-API-KEY": this.smsApiKey,
				},
			},
		);

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return response.data;
	}
}
