import { HttpStatus } from "@nestjs/common";

import { ApplicationPromptID } from "../../../lib/prompt/applicationPrompt";
import { BaseError } from "../../../common/base/baseError";

export class TrainingNotFoundError extends BaseError {
	constructor(message?: string) {
		super(
			ApplicationPromptID.TRAINING_CATEGORY_NOT_FOUND_ERROR,
			{
				message: message ?? "",
			},
			HttpStatus.NOT_FOUND,
		);
	}
}
