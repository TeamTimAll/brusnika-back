import { HttpStatus } from "@nestjs/common";

import { ApplicationPromptID } from "../../lib/prompt/applicationPrompt";
import { BaseError } from "../base/baseError";

export class FileNotFoundError extends BaseError {
	constructor(message?: string) {
		super(
			ApplicationPromptID.FILE_NOT_FOUND_ERROR,
			{ message: message ?? "" },
			HttpStatus.NOT_FOUND,
		);
	}
}
