import { BaseError } from "../../../common/base/baseError";
import { ApplicationPromptID } from "../../../lib/prompt/applicationPrompt";

export class UserNotFoundError extends BaseError {
  constructor(message?: string) {
    super(ApplicationPromptID.USER_FOUND_ERROR, {
      message: message ?? "",
    });
  }
}
