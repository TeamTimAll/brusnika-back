import { BaseError } from '../../../common/baseError';
import { ApplicationPromptID } from '../../../lib/prompt/applicationPrompt';
import { PromptType } from '../../../lib/prompt/prompt';

export class UserNotFoundError extends BaseError {
  constructor(message?: string) {
    super(PromptType.APPLICATION, ApplicationPromptID.INVALID_TOKEN_ERROR, {
      message: message ?? '',
    });
  }
}
