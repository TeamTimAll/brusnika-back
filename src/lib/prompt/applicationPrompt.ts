import { IPromptMap } from "./prompt";

export enum ApplicationPromptID {
	// Auth Errors
	UNAUTHORIZED_ERROR = 270,
	INVALID_TOKEN_ERROR = 271,
	TOKEN_EXPIRED_ERROR = 272,
	PERMISITION_DENIED_ERROR = 273,

	// Internal Errors
	INPUT_VALIDATION_ERROR = 300,
	METHOD_NOT_FOUND_ERROR,
	INTERNAL_SERVER_ERROR,

	// Module Errors
	USER_FOUND_ERROR = 303,
	CITY_FOUND_ERROR = 304,
}

export const ApplicationPrompts: IPromptMap = {
	[ApplicationPromptID.INPUT_VALIDATION_ERROR]: {
		promptId: ApplicationPromptID.INPUT_VALIDATION_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "input_validation_error",
		promptLabels: [
			"Input validation error",
			"Input validation error",
			"Input validation error",
		],
	},
	[ApplicationPromptID.METHOD_NOT_FOUND_ERROR]: {
		promptId: ApplicationPromptID.METHOD_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "method_not_found_error",
		promptLabels: [
			"Method not found error",
			"Method not found error",
			"Method not found error",
		],
	},
	[ApplicationPromptID.INTERNAL_SERVER_ERROR]: {
		promptId: ApplicationPromptID.INTERNAL_SERVER_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "internal_server_error",
		promptLabels: [
			"Internal server error",
			"Internal server error",
			"Internal server error",
		],
	},
	[ApplicationPromptID.USER_FOUND_ERROR]: {
		promptId: ApplicationPromptID.USER_FOUND_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "user_not_found_error",
		promptLabels: [
			"User not found error",
			"User not found error",
			"User not found error",
		],
	},
	[ApplicationPromptID.CITY_FOUND_ERROR]: {
		promptId: ApplicationPromptID.CITY_FOUND_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "city_not_found_error",
		promptLabels: [
			"City not found error",
			"City not found error",
			"City not found error",
		],
	},
};
