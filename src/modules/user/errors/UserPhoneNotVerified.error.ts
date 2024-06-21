import { HttpStatus } from "@nestjs/common";

import { BaseError } from "../../../common/base/baseError";
import { ApplicationPromptID } from "../../../lib/prompt/applicationPrompt";

export class UserPhoneNotVerifiedError extends BaseError {
	constructor(message?: string) {
		super(
			ApplicationPromptID.USER_PHONE_NOT_VERIFIED_ERROR,
			{
				message: message ?? "",
			},
			HttpStatus.NOT_FOUND,
		);
	}
}
