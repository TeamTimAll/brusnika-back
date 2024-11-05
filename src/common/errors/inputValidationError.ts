import { BaseError, IMetaError } from "../../common/base/baseError";
import { ApplicationPromptID } from "../../lib/prompt/applicationPrompt";

export class InputValidationError extends BaseError {
	constructor(meta: IMetaError) {
		super(ApplicationPromptID.INPUT_VALIDATION_ERROR, meta);
	}
}
