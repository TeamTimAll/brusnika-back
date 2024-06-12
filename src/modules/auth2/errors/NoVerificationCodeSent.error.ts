import { HttpStatus } from "@nestjs/common";

import { BaseError } from "../../../common/base/baseError";
import { ApplicationPromptID } from "../../../lib/prompt/applicationPrompt";

export class NoVerificationCodeSentError extends BaseError {
	constructor(message?: string) {
		super(
			ApplicationPromptID.NO_VERIFICATION_CODE_SENT_ERROR,
			{
				message: message ?? "",
			},
			HttpStatus.CONFLICT,
		);
	}
}
