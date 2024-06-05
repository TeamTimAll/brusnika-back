import { PromptType } from '../lib/prompt/prompt';
import { PromptReader } from '../lib/prompt/promptReader';

export class BaseError extends Error {
  public readonly labels: string[];
  constructor(
    promptType: PromptType,
    public readonly id: number,
    public readonly meta = {},
  ) {
    super('Error id: ' + String(id));
    const promptReader = new PromptReader(promptType);
    const prompt = promptReader.getPromptById(id);
    this.labels = prompt!.promptLabels;
  }
}
