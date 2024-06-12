import { HttpStatus } from "@nestjs/common";

import { BaseError } from "../../../common/base/baseError";
import { ApplicationPromptID } from "../../../lib/prompt/applicationPrompt";

export class UnauthorizedError extends BaseError {
	constructor(message?: string) {
		super(
			ApplicationPromptID.UNAUTHORIZED_ERROR,
			{
				message: message ?? "",
			},
			HttpStatus.UNAUTHORIZED,
		);
	}
}
