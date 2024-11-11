import { Injectable } from "@nestjs/common";
import axios from "axios";

import { ConfigManager } from "../../config";

@Injectable()
export class SmsService {
	private readonly smsApi: string;
	constructor() {
		this.smsApi = ConfigManager.config.SMS_API_URL;
	}

	private getToken(): string {
		// private async getToken(): Promise<string> {
		// const { data: result } = await axios.post(`${this.smsApi}/auth/login`, {
		// 	email: this.smsEmail,
		// 	password: this.smsPassword,
		// });

		// return result.data.token;

		return "string";
	}

	async sendMessage(code: number, phone_number: string) {
		// const token = await this.getToken();
		const token = this.getToken();

		const body = {
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
					Authorization: `Bearer ${token}`,
				},
			},
		);

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return response.data;
	}
}
