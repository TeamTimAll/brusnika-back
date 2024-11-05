import { HttpStatus } from "@nestjs/common";

import { BaseError } from "../../../common/base/baseError";
import { ApplicationPromptID } from "../../../lib/prompt/applicationPrompt";

export class UserPasswordIsNotCorrectError extends BaseError {
	constructor(message?: string) {
		super(
			ApplicationPromptID.USER_PASSWORD_IS_NOT_CORRECT_ERROR,
			{
				message: message ?? "",
			},
			HttpStatus.BAD_REQUEST,
		);
	}
}
