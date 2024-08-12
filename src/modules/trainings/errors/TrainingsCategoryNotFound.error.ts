import { HttpStatus } from "@nestjs/common";

import { BaseError } from "../../../common/base/baseError";
import { ApplicationPromptID } from "../../../lib/prompt/applicationPrompt";

export class TrainingCategoryNotFoundError extends BaseError {
	constructor(message?: string) {
		super(
			ApplicationPromptID.TRAININGS_CATEGORY_NOT_FOUND_ERROR,
			{
				message: message ?? "",
			},
			HttpStatus.NOT_FOUND,
		);
	}
}
