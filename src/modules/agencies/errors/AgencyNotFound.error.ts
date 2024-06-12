import { HttpStatus } from "@nestjs/common";

import { BaseError } from "../../../common/base/baseError";
import { ApplicationPromptID } from "../../../lib/prompt/applicationPrompt";

export class AgencyNotFoundError extends BaseError {
	constructor(message?: string) {
		super(
			ApplicationPromptID.AGENCY_NOT_FOUND_ERROR,
			{
				message: message ?? "",
			},
			HttpStatus.NOT_FOUND,
		);
	}
}
