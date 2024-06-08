import { IPromptMap } from "./prompt";

export enum ApplicationPromptID {
	// Auth Errors
	// UNAUTHORIZED_ERROR = 270,
	// INVALID_TOKEN_ERROR = 271,
	// TOKEN_EXPIRED_ERROR = 272,
	// PERMISITION_DENIED_ERROR = 273,

	// Internal Errors
	INPUT_VALIDATION_ERROR = 300,
	METHOD_NOT_FOUND_ERROR = 301,
	INTERNAL_SERVER_ERROR = 302,

	// Module Errors
	USER_NOT_FOUND_ERROR = 303,
	CITY_NOT_FOUND_ERROR = 304,
	PROJECT_NOT_FOUND_ERROR = 305,
	BUILDING_NOT_FOUND_ERROR = 306,
	UPBM_NOT_FOUND_ERROR = 307,
	USER_PREMISES_BASKET_NOT_FOUND_ERROR = 308,
}

export const ApplicationPrompts: IPromptMap<ApplicationPromptID> = {
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
	[ApplicationPromptID.USER_NOT_FOUND_ERROR]: {
		promptId: ApplicationPromptID.USER_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "user_not_found_error",
		promptLabels: [
			"User not found error",
			"User not found error",
			"User not found error",
		],
	},
	[ApplicationPromptID.CITY_NOT_FOUND_ERROR]: {
		promptId: ApplicationPromptID.CITY_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "city_not_found_error",
		promptLabels: [
			"City not found error",
			"City not found error",
			"City not found error",
		],
	},
	[ApplicationPromptID.PROJECT_NOT_FOUND_ERROR]: {
		promptId: ApplicationPromptID.PROJECT_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "project_not_found_error",
		promptLabels: [
			"Project not found error",
			"Project not found error",
			"Project not found error",
		],
	},
	[ApplicationPromptID.BUILDING_NOT_FOUND_ERROR]: {
		promptId: ApplicationPromptID.BUILDING_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "building_not_found_error",
		promptLabels: [
			"Building not found error",
			"Building not found error",
			"Building not found error",
		],
	},
	[ApplicationPromptID.UPBM_NOT_FOUND_ERROR]: {
		promptId: ApplicationPromptID.UPBM_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "upbm_not_found_error",
		promptLabels: [
			"User premises basket meta not found error",
			"User premises basket meta not found error",
			"User premises basket meta not found error",
		],
	},
	[ApplicationPromptID.USER_PREMISES_BASKET_NOT_FOUND_ERROR]: {
		promptId: ApplicationPromptID.USER_PREMISES_BASKET_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "upb_not_found_error",
		promptLabels: [
			"User premises basket not found error",
			"User premises basket not found error",
			"User premises basket not found error",
		],
	},
};
