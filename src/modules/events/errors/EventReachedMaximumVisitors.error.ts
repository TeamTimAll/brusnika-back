import { HttpStatus } from "@nestjs/common";

import { BaseError } from "../../../common/base/baseError";
import { ApplicationPromptID } from "../../../lib/prompt/applicationPrompt";

export class EventReachedMaximumVisitorsError extends BaseError {
    constructor(message?: string) {
		super(
			ApplicationPromptID.EVENT_REACHED_MAXIMUM_VISITORS_ERROR,
			{ message: message ?? "" },
			HttpStatus.BAD_REQUEST,
		);
	}
}
