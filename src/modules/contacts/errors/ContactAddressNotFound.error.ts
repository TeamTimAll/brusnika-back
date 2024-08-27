import { HttpStatus } from "@nestjs/common";

import { BaseError } from "../../../common/base/baseError";
import { ApplicationPromptID } from "../../../lib/prompt/applicationPrompt";

export class ContactAddressNotFoundError extends BaseError {
	constructor(message?: string) {
		super(
			ApplicationPromptID.CONTACT_ADDRESS_NOT_FOUND_ERROR,
			{ message: message ?? "" },
			HttpStatus.NOT_FOUND,
		);
	}
}
