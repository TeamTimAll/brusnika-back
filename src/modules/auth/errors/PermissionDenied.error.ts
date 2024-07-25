import { HttpStatus } from "@nestjs/common";

import { BaseError } from "../../../common/base/baseError";
import { ApplicationPromptID } from "../../../lib/prompt/applicationPrompt";

export class PermissionDeniedError extends BaseError {
	constructor(message?: string) {
		super(
			ApplicationPromptID.PERMISSION_DENIED_ERROR,
			{
				message: message ?? "User role not allowed",
			},
			HttpStatus.FORBIDDEN,
		);
	}
}
