
import { HttpStatus } from "@nestjs/common";

import { BaseError } from "../../../common/base/baseError";
import { ApplicationPromptID } from "../../../lib/prompt/applicationPrompt";

export class VerificationCodeIsNotCorrectError extends BaseError {
	constructor(message?: string) {
		super(
			ApplicationPromptID.VERIFICATION_CODE_IS_NOT_CORRECT_ERROR,
			{
				message: message ?? "",
			},
			HttpStatus.CONFLICT,
		);
	}
}
