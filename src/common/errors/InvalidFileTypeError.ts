import { HttpStatus } from "@nestjs/common";

import { ApplicationPromptID } from "../../lib/prompt/applicationPrompt";
import { BaseError } from "../base/baseError";

export class InvalidFileTypeError extends BaseError {
	constructor(message?: string) {
		super(
			ApplicationPromptID.INVALID_FILE_TYPE_ERROR,
			{ message: message ?? "" },
			HttpStatus.BAD_REQUEST,
		);
	}
}
