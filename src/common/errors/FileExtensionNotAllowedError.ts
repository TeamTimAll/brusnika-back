import { HttpStatus } from "@nestjs/common";

import { ApplicationPromptID } from "../../lib/prompt/applicationPrompt";
import { BaseError } from "../base/baseError";

export class FileExtensionNotAllowedError extends BaseError {
	constructor(message?: string) {
		super(
			ApplicationPromptID.FILE_EXTENSION_NOT_ALLOWED_ERROR,
			{ message: message ?? "" },
			HttpStatus.BAD_REQUEST,
		);
	}
}
