import { HttpStatus } from "@nestjs/common";

import { ApplicationPromptID } from "../../../lib/prompt/applicationPrompt";
import { BaseError } from "../../../common/base/baseError";

export class TaskNotFoundError extends BaseError {
	constructor(message?: string) {
		super(
			ApplicationPromptID.TASK_NOT_FOUND_ERROR,
			{
				message: message ?? "",
			},
			HttpStatus.NOT_FOUND,
		);
	}
}
