import { HttpStatus } from "@nestjs/common";

import { BaseError } from "../../../common/base/baseError";
import { ApplicationPromptID } from "../../../lib/prompt/applicationPrompt";

export class EventInvitationNotFoundError extends BaseError {
    constructor(message?: string) {
		super(
			ApplicationPromptID.EVENT_INVITATION_NOT_FOUND_ERROR,
			{ message: message ?? "" },
			HttpStatus.NOT_FOUND,
		);
	}
}
