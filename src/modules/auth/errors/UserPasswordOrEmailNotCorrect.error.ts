import { HttpStatus } from "@nestjs/common";

import { BaseError } from "../../../common/base/baseError";
import { ApplicationPromptID } from "../../../lib/prompt/applicationPrompt";

export class UserPasswordOrEmailNotCorrectError extends BaseError {
	constructor(message?: string) {
		super(
			ApplicationPromptID.USER_PASSWORD_OR_EMAIL_NOT_CORRECT_ERROR,
			{ message: message ?? "" },
			HttpStatus.BAD_REQUEST,
		);
	}
}
