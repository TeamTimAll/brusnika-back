import { HttpStatus } from "@nestjs/common";

import { BaseError } from "../../../common/base/baseError";
import { ApplicationPromptID } from "../../../lib/prompt/applicationPrompt";

export class VerificationCodeExpiredError extends BaseError {
	constructor(message?: string) {
		super(
			ApplicationPromptID.VERIFICATION_CODE_EXPIRED_ERROR,
			{
				message: message ?? "",
			},
			HttpStatus.GONE,
		);
	}
}
