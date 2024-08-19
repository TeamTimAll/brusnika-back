import { HttpStatus } from "@nestjs/common";

import { BaseError } from "../../../common/base/baseError";
import { ApplicationPromptID } from "../../../lib/prompt/applicationPrompt";

export class UserBlockedError extends BaseError {
	constructor(message?: string) {
		super(
			ApplicationPromptID.USER_BLOCKED_ERROR,
			{ message: message ?? "" },
			HttpStatus.BAD_REQUEST,
		);
	}
}
