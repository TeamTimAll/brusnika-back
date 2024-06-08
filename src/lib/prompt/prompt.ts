import { ApplicationPrompts } from "./applicationPrompt";
import { PostgresPrompts } from "./postgresPrompt";

export type IPromptType = "postgres" | "application";

export enum PromptType {
	POSTGRES = 1,
	APPLICATION = 2,
}

export interface IPrompt<ID = number> {
	promptId: ID;
	promptType: IPromptType;
	promptCode: string;
	promptCondition: string;
	promptLabels: string[];
}

export class DefaultPrompt implements IPrompt {
	promptId = 0;
	promptType = "application" as IPromptType;
	promptCode = "default_prompt_code";
	promptCondition = "default_prompt_condition";
	promptLabels = [
		"Default prompt message",
		"Default prompt message",
		"Default prompt message",
	];
}

export type IPromptMap<T extends number = number> = {
	[x in T]: IPrompt<T>;
};

const prompts = new Map<PromptType, IPromptMap>([
	[PromptType.APPLICATION, ApplicationPrompts],
	[PromptType.POSTGRES, PostgresPrompts],
]);
export { prompts };
