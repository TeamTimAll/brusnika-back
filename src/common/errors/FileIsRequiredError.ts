import { HttpStatus } from "@nestjs/common";

import { ApplicationPromptID } from "../../lib/prompt/applicationPrompt";
import { BaseError } from "../base/baseError";

export class FileIsRequiredError extends BaseError {
	constructor(message?: string) {
		super(
			ApplicationPromptID.FILE_IS_REQUIRED_ERROR,
			{ message: message ?? "" },
			HttpStatus.BAD_REQUEST,
		);
	}
}
