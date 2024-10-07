import { BaseError } from "../../common/base/baseError";
import { ApplicationPromptID } from "../../lib/prompt/applicationPrompt";

export class MQInvalidMessageError extends BaseError {
	constructor(message?: string) {
		super(ApplicationPromptID.MQ_INVALID_MESSAGE_ERROR, {
			message: message ?? "",
		});
	}
}
