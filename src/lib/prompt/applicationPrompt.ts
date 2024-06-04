import { CustomPrompt } from "./prompt";

export enum ApplicationPromptID {
	UNAUTHORIZED_ERROR = 270,
	INVALID_TOKEN_ERROR = 271,
	TOKEN_EXPIRED_ERROR = 272,
	PERMISITION_DENIED_ERROR = 273,

	INPUT_VALIDATION_ERROR = 300,
	METHOD_NOT_FOUND_ERROR,
	INTERNAL_SERVER_ERROR,
	BIGINT_ERROR,

	SERVICE_TYPE_NOT_FOUND_ERROR,
	TERM_NOT_FOUND_ERROR,
	TERM_NOT_VALID_ERROR,
	TAXONOMY_NOT_FOUND_ERROR,
	TAXONOMY_NOT_VALID_ERROR,
	KA_NOT_FOUND_ERROR,
	KA_NOT_VALID_ERROR,
	SPACE_NOT_FOUND_ERROR,
	SPACE_NOT_VALID_ERROR,
}

export type IApplicationPrompt = CustomPrompt<
	ApplicationPromptID,
	"application"
>;

export const ApplicationPrompts: IApplicationPrompt[] = [
	{
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
	{
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
	{
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
	{
		promptId: ApplicationPromptID.BIGINT_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "value_must_be_bigint_error",
		promptLabels: [
			"Value must be bigint error",
			"Value must be bigint error",
			"Value must be bigint error",
		],
	},
	{
		promptId: ApplicationPromptID.UNAUTHORIZED_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "unauthorized_error",
		promptLabels: [
			"Unauthorized error",
			"Unauthorized error",
			"Unauthorized error",
		],
	},
	{
		promptId: ApplicationPromptID.INVALID_TOKEN_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "invalid_token_error",
		promptLabels: [
			"Invalid token error",
			"Invalid token error",
			"Invalid token error",
		],
	},
	{
		promptId: ApplicationPromptID.TOKEN_EXPIRED_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "token_expired_error",
		promptLabels: [
			"Token expired error",
			"Token expired error",
			"Token expired error",
		],
	},
	{
		promptId: ApplicationPromptID.PERMISITION_DENIED_ERROR,
		promptType: "application",
		promptCode: "",
		promptCondition: "permisition_denied_error",
		promptLabels: [
			"Permisition denied error",
			"Permisition denied error",
			"Permisition denied error",
		],
	},
	{
		promptId: ApplicationPromptID.SERVICE_TYPE_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "service_type_not_found_error",
		promptCondition: "",
		promptLabels: [
			"ServiceType not found error",
			"ServiceType not found error",
			"ServiceType not found error",
		],
	},

	{
		promptId: ApplicationPromptID.TERM_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "term_not_found_error",
		promptCondition: "",
		promptLabels: [
			"Term not found error",
			"Term not found error",
			"Term not found error",
		],
	},
	{
		promptId: ApplicationPromptID.TERM_NOT_VALID_ERROR,
		promptType: "application",
		promptCode: "term_not_valid_error",
		promptCondition: "",
		promptLabels: [
			"Term not valid error",
			"Term not valid error",
			"Term not valid error",
		],
	},
	{
		promptId: ApplicationPromptID.TAXONOMY_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "taxonomy_not_found_error",
		promptCondition: "",
		promptLabels: [
			"Taxonomy not found error",
			"Taxonomy not found error",
			"Taxonomy not found error",
		],
	},
	{
		promptId: ApplicationPromptID.TAXONOMY_NOT_VALID_ERROR,
		promptType: "application",
		promptCode: "taxonomy_not_valid_error",
		promptCondition: "",
		promptLabels: [
			"Taxonomy not valid error",
			"Taxonomy not valid error",
			"Taxonomy not valid error",
		],
	},
	{
		promptId: ApplicationPromptID.KA_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "ka_not_found_error",
		promptCondition: "",
		promptLabels: [
			"Ka not found error",
			"Ka not found error",
			"Ka not found error",
		],
	},
	{
		promptId: ApplicationPromptID.KA_NOT_VALID_ERROR,
		promptType: "application",
		promptCode: "ka_not_valid_error",
		promptCondition: "",
		promptLabels: [
			"Ka not valid error",
			"Ka not valid error",
			"Ka not valid error",
		],
	},
	{
		promptId: ApplicationPromptID.SPACE_NOT_FOUND_ERROR,
		promptType: "application",
		promptCode: "space_not_found_error",
		promptCondition: "",
		promptLabels: [
			"Space not found error",
			"Space not found error",
			"Space not found error",
		],
	},
	{
		promptId: ApplicationPromptID.SPACE_NOT_VALID_ERROR,
		promptType: "application",
		promptCode: "space_not_valid_error",
		promptCondition: "",
		promptLabels: [
			"Space not valid error",
			"Space not valid error",
			"Space not valid error",
		],
	},
];
