import { HttpStatus } from "@nestjs/common";

import {
	DefaultPrompt,
	PromptLabel,
	PromptType,
} from "../../lib/prompt/prompt";
import { PromptReader } from "../../lib/prompt/promptReader";

export interface IMetaError {
	message: string;
	meta?: object;
}

export class BaseError extends Error {
	public readonly id: number;
	public readonly labels: PromptLabel;
	public readonly meta!: IMetaError;
	public readonly status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

	constructor(
		id: number,
		meta: IMetaError,
		status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
		promptType: PromptType = PromptType.APPLICATION,
		code?: string,
	) {
		super();

		const promptReader = new PromptReader(promptType);
		let prompt = new DefaultPrompt();
		if (promptType === PromptType.APPLICATION) {
			prompt = promptReader.getPromptById(id);
		} else if (promptType === PromptType.POSTGRES) {
			prompt = promptReader.getPromptByCode(code ?? "");
		}

		this.id = prompt.promptId;
		this.meta = meta;
		this.status = status;
		this.labels = prompt.promptLabels;
	}
}
