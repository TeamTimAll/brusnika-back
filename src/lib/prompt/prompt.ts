import { ApplicationPrompts } from "./applicationPrompt";
import { PostgresPrompts } from "./postgresPrompt";

export type IPromptType = "postgres" | "application";

export enum PromptType {
	POSTGRES = 1,
	APPLICATION = 2,
	EXTERNAL = 3
}

export interface PromptLabel {
	ru: string;
	uz: string;
	en: string;
}

export interface IPrompt<ID = number> {
	promptId: ID;
	promptType: IPromptType;
	promptCode: string;
	promptCondition: string;
	promptLabels: PromptLabel;
}

export class DefaultPrompt implements IPrompt {
	private readonly message!: string;

	constructor(message: string = "Default prompt message") {
		this.message = message;
	}

	promptId: number = 0;
	promptType: IPromptType = "application";
	promptCode: string = "default_prompt_code";
	promptCondition: string = "default_prompt_condition";
	promptLabels: PromptLabel = {
		ru: this.message,
		uz: this.message,
		en: this.message,
	};
}

export type IPromptMap<T extends number = number> = {
	[x in T]: IPrompt<T>;
};

const prompts = new Map<PromptType, IPromptMap>([
	[PromptType.APPLICATION, ApplicationPrompts],
	[PromptType.POSTGRES, PostgresPrompts],
]);
export { prompts };
