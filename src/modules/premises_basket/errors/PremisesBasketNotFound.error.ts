import { HttpStatus } from "@nestjs/common";

import { BaseError } from "../../../common/base/baseError";
import { ApplicationPromptID } from "../../../lib/prompt/applicationPrompt";

export class PremisesBasketNotFoundError extends BaseError {
	constructor(message?: string) {
		super(
			ApplicationPromptID.PREMISES_BASKET_NOT_FOUND_ERROR,
			{
				message: message ?? "",
			},
			HttpStatus.NOT_FOUND,
		);
	}
}
