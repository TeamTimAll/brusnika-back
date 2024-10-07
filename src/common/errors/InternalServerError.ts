import { BaseError } from "../../common/base/baseError";
import { ApplicationPromptID } from "../../lib/prompt/applicationPrompt";

export class InternalServerError extends BaseError {
	constructor(message?: string) {
		super(ApplicationPromptID.INTERNAL_SERVER_ERROR, {
			message: message ?? "",
		});
	}
}
