import { HttpStatus } from "@nestjs/common";

import { BaseError } from "../../../common/base/baseError";
import { ApplicationPromptID } from "../../../lib/prompt/applicationPrompt";

export class UserEmailAlreadyExistsError extends BaseError {
    constructor(message?: string) {
		super(
			ApplicationPromptID.USER_EMAIL_ALREADY_EXISTS_ERROR,
			{
				message: message ?? "",
			},
			HttpStatus.CONFLICT,
		);
	}
}
