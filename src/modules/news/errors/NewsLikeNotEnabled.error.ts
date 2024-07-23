import { HttpStatus } from "@nestjs/common";

import { BaseError } from "../../../common/base/baseError";
import { ApplicationPromptID } from "../../../lib/prompt/applicationPrompt";

export class NewsLikeNotEnabledError extends BaseError {
    constructor(message?: string) {
		super(
			ApplicationPromptID.NEWS_LIKE_NOT_ENABLED_ERROR,
			{
				message: message ?? "",
			},
			HttpStatus.NOT_FOUND,
		);
	}
}
