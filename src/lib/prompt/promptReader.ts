import { MetaPrompt } from "common/base/base_dto";

import { IPrompt, IPromptMap, PromptType, prompts } from "./prompt";

export class PromptReader {
	private prompts: IPromptMap;
	constructor(type: PromptType) {
		this.prompts = prompts.get(type) as IPromptMap;
	}
	getPromptById(id: number): IPrompt {
		const foundPrompt = this.prompts[id];
		return foundPrompt;
	}

	getPromptByCode(code: string): IPrompt {
		let foundPrompt: IPrompt = {
			promptId: 0,
			promptType: "postgres",
			promptCode: "",
			promptCondition: "",
			promptLabels: [],
		};
		for (const key in this.prompts) {
			if (Object.prototype.hasOwnProperty.call(this.prompts, key)) {
				const element = this.prompts[key];
				if (element.promptCode === code) {
					foundPrompt = element;
				}
			}
		}
		return foundPrompt;
	}

	setPrompt(id: number, metaPrompt: MetaPrompt) {
		const prompt = this.getPromptById(id);
		metaPrompt.id = prompt.promptId;
		metaPrompt.labels = prompt.promptLabels;
	}
}
