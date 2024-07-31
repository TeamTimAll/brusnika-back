import { HttpStatus } from "@nestjs/common";

import { BaseError } from "../../../common/base/baseError";
import { ApplicationPromptID } from "../../../lib/prompt/applicationPrompt";

export class MaxCreatableBookingCountReachedError extends BaseError {
	constructor(message?: string) {
		super(
			ApplicationPromptID.MAX_CREATABLE_BOOKING_COUNT_REACHED_ERROR,
			{
				message: message ?? "",
			},
			HttpStatus.BAD_REQUEST,
		);
	}
}
