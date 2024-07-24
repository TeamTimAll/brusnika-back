import { HttpStatus } from "@nestjs/common";

import { BaseError } from "../../../common/base/baseError";
import { ApplicationPromptID } from "../../../lib/prompt/applicationPrompt";

export class EventsNotFoundError extends BaseError {
	constructor(message?: string) {
		super(
			ApplicationPromptID.EVENTS_NOT_FOUND_ERROR,
			{ message: message ?? "" },
			HttpStatus.NOT_FOUND,
		);
	}
}
