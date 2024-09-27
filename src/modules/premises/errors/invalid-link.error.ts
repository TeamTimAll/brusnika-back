import { HttpStatus } from "@nestjs/common";

import { BaseError } from "../../../common/base/baseError";
import { ApplicationPromptID } from "../../../lib/prompt/applicationPrompt";

export class InvalidLinkError extends BaseError {
	constructor(message?: string) {
		super(
			ApplicationPromptID.INVALID_LINK,
			{
				message: message ?? "",
			},
			HttpStatus.BAD_REQUEST,
		);
	}
}
