import { HttpStatus } from "@nestjs/common";

import { BaseError } from "../../../common/base/baseError";
import { ApplicationPromptID } from "../../../lib/prompt/applicationPrompt";

export class ProjectNotFoundError extends BaseError {
    constructor(message?: string) {
		super(
			ApplicationPromptID.PROJECT_NOT_FOUND_ERROR,
			{
				message: message ?? "",
			},
			HttpStatus.NOT_FOUND,
		);
	}
}
