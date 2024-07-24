import { HttpStatus } from "@nestjs/common";

import { BaseError } from "../../../common/base/baseError";
import { ApplicationPromptID } from "../../../lib/prompt/applicationPrompt";

export class UserAlreadyRegisteredToEventError extends BaseError {
	constructor(message?: string) {
		super(
			ApplicationPromptID.USER_ALREADY_REGISTERED_TO_EVENT_ERROR,
			{ message: message ?? "" },
			HttpStatus.BAD_REQUEST,
		);
	}
}
