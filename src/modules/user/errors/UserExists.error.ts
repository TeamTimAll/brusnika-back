import { HttpStatus } from "@nestjs/common";

import { BaseError } from "../../../common/base/baseError";
import { ApplicationPromptID } from "../../../lib/prompt/applicationPrompt";

export class UserAlreadyExistsError extends BaseError {
	constructor(message?: string) {
		super(
			ApplicationPromptID.USER_ALREADY_EXISTS_ERROR,
			{ message: message ?? "" },
			HttpStatus.BAD_REQUEST,
		);
	}
}
