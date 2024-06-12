import { HttpStatus } from "@nestjs/common";

import { BaseError } from "../../../common/base/baseError";
import { ApplicationPromptID } from "../../../lib/prompt/applicationPrompt";

export class VerificationExistsError extends BaseError {
	constructor(message?: string) {
		super(
			ApplicationPromptID.VERIFICATION_EXISTS_ERROR,
			{
				message: message ?? "",
			},
			HttpStatus.BAD_REQUEST,
		);
	}
}
