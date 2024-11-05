import { HttpStatus } from "@nestjs/common";

import { BaseError } from "../../../common/base/baseError";
import { ApplicationPromptID } from "../../../lib/prompt/applicationPrompt";

export class MoreInitialPaymentError extends BaseError {
	constructor(message?: string) {
		super(
			ApplicationPromptID.MORE_INITIAL_PAYMENT_ERROR,
			{
				message: message ?? "",
			},
			HttpStatus.NOT_FOUND,
		);
	}
}
