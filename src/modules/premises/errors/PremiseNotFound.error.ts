import { HttpStatus } from "@nestjs/common";

import { BaseError } from "../../../common/base/baseError";
import { ApplicationPromptID } from "../../../lib/prompt/applicationPrompt";

export class PremiseNotFoundError extends BaseError {
    constructor(message?: string) {
		super(
			ApplicationPromptID.PREMISE_NOT_FOUND_ERROR,
			{
				message: message ?? "",
			},
			HttpStatus.NOT_FOUND,
		);
	}
}
