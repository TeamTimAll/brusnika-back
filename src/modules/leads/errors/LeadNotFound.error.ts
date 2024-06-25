import { HttpStatus } from "@nestjs/common";

import { BaseError } from "../../../common/base/baseError";
import { ApplicationPromptID } from "../../../lib/prompt/applicationPrompt";

export class LeadNotFoundError extends BaseError {
	constructor(message: string) {
		super(
			ApplicationPromptID.LEAD_NOT_FOUND_ERROR,
			{ message: message ?? "" },
			HttpStatus.NOT_FOUND,
		);
	}
}
